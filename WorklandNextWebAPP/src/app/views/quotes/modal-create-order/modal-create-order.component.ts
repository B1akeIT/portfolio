import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { forkJoin, Observable, of, Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { ModalCreateOrderService } from './modal-create-order.service';
import { TablesService } from '@app/views/tables/tables.service';
import { GridUtils } from '@app/utils/grid-utils';
import { QuotesService } from '../quotes.service';

import { ModalContactComponent } from '@app/components/modal-contact/modal-contact.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-modal-create-order',
  templateUrl: './modal-create-order.component.html',
  styleUrls: ['./modal-create-order.component.scss']
})
export class ModalCreateOrderComponent implements OnInit, AfterViewInit, AfterViewChecked {

  id: number = 0;
  model: string = 'quote';
  item: any = null;
  quoteList: any[] = [];
  data: any = {
    item: {},
    parametri: {
      sezionaleId: 0,
      tassoDiConversione: 0,
      operatoreDiConversione: '*',
      isRaggruppamentoDestinazione: false,
      isRaggruppamentoSezionale: false,
      isRaggruppamentoCategoria: false,
      isRaggruppamentoData: false,
      dataDocumento: null,
      numDocumento: 0,
      aziendaId: 0
    },
    testateList: [],
    dettagliList: []
  };
  sostituisciTestata = false;
  escludiRigheOrdinate = true;

  originalData: any = null;
  difference = null;

  openCreatedDocument = true;

  onClose: Subject<any>;

  elem: ElementRef;
  _H = 0;

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  anagrafiche = [];

  modalContactRef: BsModalRef;
  modalChoiceRef: BsModalRef;

  _isOrderSupplier = false;

  anagraficheCombo = [];
  operators = [
    { id: 1, value: '*', description: '*'},
    { id: 2, value: '/', description: '/'}
  ];

  @HostListener('window:resize', ['$event']) onResize() {
    this._styleBodyDialog();
  }

  _filterClient = true;
  _filterClientCount = 0;

  _gridApi;
  gridInitialized = false;
  _gridColumnApi;

  _agDefaultColumnDefs = null;
  _agColumnDefs = [];
  _agGridOptions = {};

  _schema = [];
  selectedQuotes = [];

  step = 1;

  itemList = [];

  constructor(
    protected el: ElementRef,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private modalCreateOrderService: ModalCreateOrderService,
    private tablesService: TablesService,
    private gridUtils: GridUtils,
    private quotesService: QuotesService
  ) {
    this.elem = el;

    const tenant = this.authenticationService.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);

    this.quotesService.setTenent(tenant);

    const combos = [
      {
        name: 'SpComboSezionale', aziendaId: this.item.aziendaId,
        param: `{"TipoDocumentoId":${this.item.tipoDocumentoId}}`
      },
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();

    this._isOrderSupplier = (this.model === 'order-supplier');

    this.modalCreateOrderService.reset();
    let _model = '';
    switch (this.model) {
      case 'quote':
        _model = 'PreventivoTestata';
        break;
    }
    this.modalCreateOrderService.setModel(_model);
    this.modalCreateOrderService.setTenent(tenant);

    this.onClose = new Subject();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);

    const tables = [
      'AnagNazione'
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    this.loading = false;
    this.modalCreateOrderService.getDefaultValues().subscribe(
      (response: any) => {
        this.data.parametri.sezionaleId = response.sezionaleId;
        this.data.parametri.tassoDiConversione = response.TassoDiConversione;
        this.data.parametri.operatoreDiConversione = response.OperatoreDiConversione;
        this.data.parametri.isRaggruppamentoDestinazione = response.IsRaggruppamentoDestinazione;
        this.data.parametri.isRaggruppamentoSezionale = response.IsRaggruppamentoSezionale;
        this.data.parametri.isRaggruppamentoCategoria = response.IsRaggruppamentoCategoria;
        this.data.parametri.isRaggruppamentoData = response.IsRaggruppamentoData;
        this.data.parametri.dataDocumento = response.DataCreazione ? moment(response.DataCreazione, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;
        // this.data.parametri.numDocumento = response.NumDocumento;
        // this.data.parametri.aziendaId = response.AziendaId;

        this.escludiRigheOrdinate = response.IsEscludiRigheOrdinate;
        this.openCreatedDocument = response.ApriDocumentoCreato;

        this.loading = false;
        if (this.quoteList.length > 0) {
          if (this._filterClient) {
            const _count = this.quoteList.length;
            this.quoteList = this.quoteList.filter((item) => item.isCliente);
            this._filterClientCount = _count - this.quoteList.length;
          }
          this.initData();
        } else {
          this.step = 2;
          this.loadItem();
        }
      },
      (error: any) => {
        this.loading = false;
        this.loadItem();
      }
    );
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this._styleBodyDialog();
    }, 100);
  }

  _styleBodyDialog() {
    const height = this.elem.nativeElement.clientHeight;
    this._H = height - 56 - 70;
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  loadItem() {
    if (this.id) {
      this.loading = false;
      this.modalCreateOrderService.getModel(this.id).subscribe(
        (response: any) => {
          const _quote = this.gridUtils.renameJson(response);
          this.item = _quote;
          this.data.item = _quote;

          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    }
  }

  modifiedModel(obj1, obj2) {
    this.difference = this.utilsService.objectsDiff(obj1, obj2);
    return !_.isEmpty(this.difference);
  }

  isModifiedProperty(property) {
    return (this.difference && this.difference.hasOwnProperty(property));
  }

  openChoiceModal(type) {
    let initialState = {};

    switch (type) {
      case 'intestatario':
        if (this.model === 'order-supplier') {
          initialState = {
            model: type,
            nomeSp: 'SpComboFornitoreLookUp',
            item: {}
          };
        } else {
          initialState = {
            model: type,
            nomeSp: 'SpComboContattoLookUp',
            item: {}
          };
        }
        break;
      case 'fatturazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboClienteLookUp',
          item: {}
        };
        break;
      case 'destinazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboDestinazioneLookUp',
          item: {}
        };
        break;
    }

    this.modalChoiceRef = this.modalService.show(ModalLookupComponent, {
      id: 'modalChoice',
      backdrop: 'static',
      ignoreBackdropClick: true,
      class: 'modal-lg-full',
      initialState: initialState
    });
    this.modalChoiceRef.content.onClose.subscribe(
      (result: any) => {
        if (result) {
          const _result = this._fixKeys(result);
          this.onChangeContact(type, _result);
        }
        // this.modalService.hide('modalChoice');
      }
    );
  }

  _fixKeys(data) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      const newKey = _.lowerFirst(key);
      data[newKey] = data[key];
      delete data[key];
    });

    return data;
  }

  onFormChanges($event) {
    this.modifiedModel(this.data, this.originalData);
  }

  onChangeContact(type, event) {
    switch (type) {
      case 'intestatario':
        this.data.item.contattoIntestatarioId = event?.contattoId;
        this.data.item.nominativoIntestatario = event?.ragioneSociale;
        this.data.item.indirizzoIntestatario = event?.indirizzo;
        this.data.item.comuneIntestatario = event?.comune;
        this.data.item.provinciaIntestatario = event?.provincia;
        this.data.item.capIntestatario = event?.cap;
        this.data.item.nazioneIntestatario = event?.nazione;
        this.data.item.nazioneIntestatarioId = event?.anagNazione;
        this.data.item.codiceFiscale = event?.codiceFiscale;
        this.data.item.piva = event?.pIva;
        break;
      case 'fatturazione':
        this.data.item.contattoFatturazioneId = event?.contattoId;
        this.data.item.nominativoFatturazione = event?.ragioneSociale;
        this.data.item.indirizzoFatturazione = event?.indirizzo;
        this.data.item.comuneFatturazione = event?.comune;
        this.data.item.provinciaFatturazione = event?.provincia;
        this.data.item.capFatturazione = event?.cap;
        this.data.item.nazioneFatturazione = event?.nazione;
        this.data.item.nazioneFatturazioneId = event?.anagNazione;
        break;
      case 'destinazione':
        this.data.item.contattoDestinazioneId = event?.contattoId;
        this.data.item.nominativoDestinazione = event?.ragioneSociale;
        this.data.item.indirizzoDestinazione = event?.indirizzo;
        this.data.item.comuneDestinazione = event?.comune;
        this.data.item.provinciaDestinazione = event?.provincia;
        this.data.item.capDestinazione = event?.cap;
        this.data.item.nazioneDestinazione = event?.nazione;
        this.data.item.nazioneDestinazioneId = event?.anagNazione;
        break;
      default:
        break;
    }
    this.onFormChanges(event);
  }

  showContact(id, title) {
    const initialState = {
      contactId: id,
      contactTitle: title,
      showHeader: false,
      showFooter: false
    };
    this.modalContactRef = this.modalService.show(ModalContactComponent, {
      id: 'modalContact',
      ignoreBackdropClick: true,
      class: 'modal-lg-full',
      initialState: initialState
    });
    this.modalContactRef.content.onClose.subscribe(
      (result: any) => {
        // console.log('showContact close', result);
        // this.modalService.hide('modalContact');
      }
    );
  }

  applyModal() {
    if (this.isSingle()) {
      this.data.testateList.push(this.data.item);
    }

    this.data.testateList = this.data.testateList.map(item => this.gridUtils.renameJson(item, false));
    this.data.dettagliList = this.data.dettagliList.map(item => this.gridUtils.renameJson(item, false));

    this.modalCreateOrderService.create(this.data).subscribe(
      (response) => {
        const result = { openCreatedDocument: this.openCreatedDocument, response: response };
        this.onClose.next(result);
        this.closeModal();
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  _removeItemsId(items) {
    const _items = items.map((item) => {
      delete item.id;
      return item;
    });
    return _items;
  }

  onSelectedRows(event: any) {
    this.data.dettagliList = event;
  }

  isSingle() {
    return (this.quoteList && this.quoteList.length === 0);
  }

  isMultiple() {
    return ((this.data.testateList.length > 1) || (this.quoteList && this.quoteList.length > 1));
  }

  nextStep() {
    this.step = 2;

    const ids = this.selectedQuotes.map(item => item.id);
    if (ids.length > 0) {
      this.data.testateList = [ ...this.selectedQuotes ];
      this.loadQuotesItems(ids);
    }
  }

  prevStep() {
    this.step = 1;
  }

  loadQuotesItems(ids) {
    const reqs: Observable<any>[] = [];

    this.loading = true;
    ids.forEach(id => {
      this.itemList = [];
      reqs.push(
        this.quotesService.getQuoteDetails(id)
          .pipe(
            catchError((err) => {
              console.log('loadQuotesItems error', id, err);
              return of({ items: [] });
            })
          )
      );
    });

    forkJoin(reqs).subscribe(
      (results: Array<any>) => {
        results.forEach((result, index) => {
          if (results[index] && results[index].items) {
            this.itemList = [ ...this.itemList, ...results[index].items ];
          }
        });
        this.loading = false;
      },
      (error: any) => {
        console.log('loadQuotesItems forkJoin error', error);
        this.loading = false;
      }
    );
  }

  // Quote Grid

  initData() {
    this.loading = true;

    this.quotesService.getGrid('GeneraOrdineClienteView').subscribe(
      (response: any) => {
        if (response && response.schemaDescription) {
          const jsonSchema = JSON.parse(response.schemaDescription)[0];
          const columnSchemas = JSON.parse(jsonSchema.ColumnSchemas);
          const visibilityStatus = JSON.parse(jsonSchema.VisibilityStatus);

          this._schema = columnSchemas.filter(elem => {
            const visibilityItem = _.findIndex(visibilityStatus, { 'columnName': elem.ColumnName, 'isVisible': true });
            return (visibilityItem !== -1);
          });
        } else {
          // Default schema
          this._schema = [];
        }
        this.loading = false;
        this.initAgGrid();
      },
      (error: any) => {
        console.log('getGrid error', error);
        this.loading = false;
        this.error = true;
        this.errorMessage = error.message;
      }
    );
  }

  initAgGrid() {
    this._agDefaultColumnDefs = {
      autoHeight: false,
      suppressMovable: true,
      sortable: true,
      filter: false,
      cellStyle: { 'white-space': 'normal' }
    };

    let cDef = null;
    this._schema.forEach(obj => {
      cDef = this.gridUtils.getColumnDefBySchema(obj);
      if (cDef) {
        if ((obj.ColumnName === 'id') || (obj.ColumnName === 'Id')) {
          cDef.headerCheckboxSelection = true;
          cDef.showDisabledCheckboxes = true;
          cDef.checkboxSelection = this.isRowSelectable;
          cDef.minWidth = 90;
          cDef.maxWidth = 90;
        }
        this._agColumnDefs.push(cDef);
      } else {
        console.log('Column not defined', obj);
      }
    });

    this._agGridOptions = {
      rowSelection: 'multiple',
      rowMultiSelectWithClick: true,
      suppressMultiSort: true,
      localeTextFunc: this.utilsService.localeTextFunc.bind(this),
      getRowNodeId: function(data) {
        return data.id || data.Id;
      },
      navigateToNextCell: this.utilsService.navigateToNextCell.bind(this),
      animateRows: true
    };

    this.gridInitialized = true;
  }

  isRowSelectable(params) {
    return !!params.data && params.data.isCliente;
  }

  onGridReady(params) {
    this._gridApi = params.api;
    this._gridColumnApi = params.columnApi;

    this._gridApi.resetRowHeights();
  }

  onSelectionChanged(event) {
    const selectedRows = this._gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.selectedQuotes = [];
    } else {
      this.selectedQuotes = selectedRows;
    }
  }
}
