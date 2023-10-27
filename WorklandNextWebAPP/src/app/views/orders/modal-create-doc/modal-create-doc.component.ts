import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ModalCreateDocService } from './modal-create-doc.service';
import { TablesService } from '@app/views/tables/tables.service';
import { GridUtils } from '@app/utils/grid-utils';
import { OrdersService } from '../orders.service';

import { ModalContactComponent } from '@app/components/modal-contact/modal-contact.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-create-doc',
  templateUrl: './modal-create-doc.component.html',
  styleUrls: ['./modal-create-doc.component.scss']
})
export class ModalCreateDocComponent implements OnInit, AfterViewInit, AfterViewChecked {

  id: number = 0;
  model: string = 'order';
  document: number = 0;
  documentDescription: string = '';
  item: any = null;
  aziendaId: number = 0;
  orderList: any[] = [];
  data: any = {
    item: {},
    parametri: {
      tipoDocumentoId: 0,
      sezionaleId: 0,
      magazzinoId: 0,
      anagValutaId: 0,
      cambio: 0,
      anagPortoId: 0,
      anagTrasportoACuraDelId: 0,
      vettoreId: 0,
      nominativoVettore: '',
  /* Creating a new variable called order and assigning it the value of the order variable. */
      numLetteraVettura: 0,
      isEsenteIva: false,
      anagIvaId: 0,
      dataDocumento: null,
      numDocumento: 0,
      aziendaId: 0,
      isEditSpese: true,
      isRaggruppamentoDestinazione: true,
      isRaggruppamentoSezionale: true,
      isRaggruppamentoCategoria: true,
      isRaggruppamentoData: true,
      isRaggruppamentoSezione: true,
      isRaggruppamentoAgente: true,
      isRaggruppamentoScontoAdImporto: true,
      isRaggruppamentoScontoInPercentuale: true,
      isRaggruppamentoSpeseInPercentuale: true,
      costoTrasportoValore: 0,
      scontoValore: 0,
      costoImballoValore: 0,
      altreSpese: 0,
      doganaCustom: 0,
      isOpenLogistica: 0,
      abbonamentoVettore: 0,
      isApriDocumentoCreato: 0,
      isPulisciIntestario: 0,
    },
    testateList: [],
    dettagliList: []
  };
  sostituisciTestata = true;
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

  _isDocSupplier = false;

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
  selectedOrders = [];

  step = 1;

  itemList = [];

  _disabledVettore: boolean = false;

  constructor(
    protected el: ElementRef,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private modalCreateDocService: ModalCreateDocService,
    private tablesService: TablesService,
    private gridUtils: GridUtils,
    private ordersService: OrdersService
  ) {
    this.elem = el;

    const tenant = this.authenticationService.getCurrentTenant();

    this.ordersService.setTenent(tenant);

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();

    this._isDocSupplier = (this.model === 'doc-supplier');

    this.modalCreateDocService.reset();
    let _model = '';
    switch (this.model) {
      case 'order':
        _model = 'OrdineClienteTestata';
        break;
    }
    this.modalCreateDocService.setModel(_model);
    this.modalCreateDocService.setTenent(tenant);

    this.onClose = new Subject();

    const tables = [
      'AnagNazione',
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    const combos = [
      'SpComboIva',
      {
        name: 'SpComboSezionale', aziendaId: this.aziendaId,
        param: `{"TipoDocumentoId":${this.document}}`
      },
      { name: 'SpComboMagazzino', aziendaId: this.aziendaId },
      'SpComboValuta',
      'SpComboPorto',
      'SpComboTrasportoACuraDel',
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

    this.loading = false;
    this.modalCreateDocService.getDefaultValues(this.document).subscribe(
      (response: any) => {
        const _response: any = this.gridUtils.renameJson(response);
        this.data.parametri.sezionaleId = _response.sezionaleId;
        this.data.parametri.magazzinoId = _response.magazzinoId;
        this.data.parametri.anagValutaId = _response.anagValutaId;
        this.data.parametri.cambio = _response.cambio;
        this.data.parametri.anagPortoId = _response.anagPortoId;
        this.data.parametri.anagTrasportoACuraDelId = _response.anagTrasportoACuraDelId;
        this.data.parametri.anagIvaId = _response.anagIvaId;
        this.data.parametri.isEsenteIva = _response.isEsenteIva;
        this.data.parametri.numLetteraVettura = _response.numLetteraVettura;
        this.data.parametri.tassoDiConversione = _response.tassoDiConversione;
        this.data.parametri.operatoreDiConversione = _response.operatoreDiConversione;
        this.data.parametri.isRaggruppamentoDestinazione = _response.isRaggruppamentoDestinazione;
        this.data.parametri.isRaggruppamentoSezionale = _response.isRaggruppamentoSezionale;
        this.data.parametri.isRaggruppamentoCategoria = _response.isRaggruppamentoCategoria;
        this.data.parametri.isRaggruppamentoData = _response.isRaggruppamentoData;
        this.data.parametri.isRaggruppamentoScontoAdImporto = _response.isRaggruppamentoScontoAdImporto;
        this.data.parametri.isRaggruppamentoSpeseInPercentuale = _response.isRaggruppamentoSpeseInPercentuale;
        this.data.parametri.isRaggruppamentoScontoInPercentuale = _response.isRaggruppamentoScontoInPercentuale;
        this.data.parametri.dataDocumento = _response.dataCreazione ? moment(_response.dataCreazione, 'YYYY-MM-DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        this.data.parametri.numDocumento = _response.numDocumento;
        this.data.parametri.tipoDocumentoId = this.document;
        this.data.parametri.aziendaId = _response.aziendaId;
        this.data.parametri.isOpenLogistica = _response.isOpenLogistica;
        this.data.parametri.abbonamentoVettore = _response.abbonamentoVettore;
        this.data.parametri.isApriDocumentoCreato = _response.isApriDocumentoCreato;
        this.data.parametri.isEditSpese = _response.isEditSpese;
        this.data.parametri.isPulisciIntestario = _response.isPulisciIntestario;
        this.data.parametri.tipoDocumentoCodice = _response.tipoDocumentoCodice;

        setTimeout(() => {
          this.onChangeTrasporto();
        }, 1000);

        this.loading = false;
        if (this.orderList.length > 0) {
          // if (this._filterClient) {
          //   const _count = this.orderList.length;
          //   this.orderList = this.orderList.filter((item) => item.isCliente);
          //   this._filterClientCount = _count - this.orderList.length;
          // }
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
      this.modalCreateDocService.getModel(this.id).subscribe(
        (response: any) => {
          const _order = this.gridUtils.renameJson(response);
          this.item = _order;
          this.data.item = _order;

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
        if (this.model === 'doc-supplier') {
          initialState = {
            model: type,
            nomeSp: 'SpComboFornitoreLookUp',
            item: this.item,
            searchTerm: this.item.nominativoIntestatario
          };
        } else {
          initialState = {
            model: type,
            nomeSp: 'SpComboContattoLookUp',
            item: this.item,
            searchTerm: this.item.nominativoIntestatario
          };
        }
        break;
      case 'fatturazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboClienteLookUp',
          item: this.item,
          searchTerm: this.item.nominativoFatturazione
    };
        break;
      case 'destinazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboDestinazioneLookUp',
          item: this.item,
          searchTerm: this.item.nominativoDestinazione
    };
        break;
      case 'vettore':
        initialState = {
          model: type,
          nomeSp: 'SpComboVettoreLookUp',
          item: this.item,
          searchTerm: ''
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
    // this.modifiedModel(this.data, this.originalData);
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
      case 'vettore':
        this.data.parametri.vettoreId = event?.contattoId || event?.contattoID;
        this.data.parametri.nominativoVettore = event?.ragioneSociale;
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

    this.modalCreateDocService.create(this.data).subscribe(
      (response) => {
        const result = { openCreatedDocument: this.openCreatedDocument, response: response };
        this.onClose.next(result);
        this.closeModal();
        this.notificationService.success('APP.MESSAGE.create_document_successful', 'APP.TITLE.orders');
      },
      (error) => {
        this.notificationService.error('APP.MESSAGE.create_document_unsuccessful', 'APP.TITLE.orders');
        if (error.error && error.error.Message) {
          this.notificationService.error(error.error.Message, 'APP.TITLE.orders');
        }
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
    return (this.orderList && this.orderList.length === 0);
  }

  isMultiple() {
    return ((this.data.testateList.length > 1) || (this.orderList && this.orderList.length > 1));
  }

  nextStep() {
    this.step = 2;

    const ids = this.selectedOrders.map(item => item.id);
    if (ids.length > 0) {
      this.data.testateList = [ ...this.selectedOrders ];
      this.loadOrdersItems(ids);
    }
  }

  prevStep() {
    this.step = 1;
  }

  loadOrdersItems(ids) {
    const reqs: Observable<any>[] = [];

    this.loading = true;
    ids.forEach(id => {
      this.itemList = [];
      reqs.push(
        this.ordersService.getOrderDetails(id)
          .pipe(
            catchError((err) => {
              console.log('loadOrdersItems error', id, err);
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
        console.log('loadOrdersItems forkJoin error', error);
        this.loading = false;
      }
    );
  }

  // Order Grid

  initData() {
    this.loading = true;

    this.ordersService.getGrid('RicercaOrdineClienteTestataView').subscribe(
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
          cDef.minWidth = 70;
          cDef.maxWidth = 70;
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
    return !!params.data;
  }

  onGridReady(params) {
    this._gridApi = params.api;
    this._gridColumnApi = params.columnApi;

    this._gridApi.resetRowHeights();
  }

  onSelectionChanged(event) {
    const selectedRows = this._gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      this.selectedOrders = [];
    } else {
      this.selectedOrders = selectedRows;
    }
  }

  onChangeTrasporto() {
    if (this.data.parametri.anagTrasportoACuraDelId) {
      const traspArr = this.anagraficheCombo['SpComboTrasportoACuraDel'];
      const index = traspArr.findIndex(item => item.id === Number(this.data.parametri.anagTrasportoACuraDelId));
      const trasp = traspArr[index];
      this._disabledVettore = !trasp.isVettore;
    }
  }
}
