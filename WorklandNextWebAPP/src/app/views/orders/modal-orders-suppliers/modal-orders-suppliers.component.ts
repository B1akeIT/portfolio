import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { forkJoin, Observable, of, Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ModalOrdersSuppliersService } from './modal-orders-suppliers.service';
import { TablesService } from '@app/views/tables/tables.service';
import { GridUtils } from '@app/utils/grid-utils';
import { OrdersService } from '../orders.service';

import { ModalContactComponent } from '@app/components/modal-contact/modal-contact.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-modal-orders-suppliers',
  templateUrl: './modal-orders-suppliers.component.html',
  styleUrls: ['./modal-orders-suppliers.component.scss']
})
export class ModalOrdersSuppliersComponent implements OnInit, AfterViewInit, AfterViewChecked {

  id: number = 0;
  model: string = 'order';
  item: any = null;
  document: number = 0;
  documentDescription: string = '';
  orderList: any[] = [];
  data: any = {
    parametri: {
      sezionaleId: 0,
      aziendaId: 0,
      fornitoreId: 0,
      isFornitoreDaArticolo: false
    },
    testateList: [],
    dettagliList: []
  };

  supplier: any = null;

  originalData: any = null;
  difference = null;

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

  openCreatedDocument = true;

  constructor(
    protected el: ElementRef,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private modalOrdersSuppliersService: ModalOrdersSuppliersService,
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

    this.modalOrdersSuppliersService.reset();
    let _model = '';
    switch (this.model) {
      case 'order':
        _model = 'OrdineClienteTestata';
        break;
    }
    this.modalOrdersSuppliersService.setModel(_model);
    this.modalOrdersSuppliersService.setTenent(tenant);

    this.onClose = new Subject();

    this.loading = false;
    this.modalOrdersSuppliersService.getDefaultValues().subscribe(
      (response: any) => {
        // this.data.parametri.tipoDocumentoId = response.tipoDocumentoId;
        this.data.parametri.sezionaleId = response.sezionaleId;
        this.data.parametri.isFornitoreDaArticolo = response.IsFornitoreDaArticolo;
        this.data.parametri.isEscludiRighePreparate = response.IsEscludiRighePreparate;
        this.data.parametri.isEscludiRigheOrdinate = response.IsEscludiRigheOrdinate;
        this.data.parametri.isEscludiRigheComplete = response.IsEscludiRigheComplete;
        // this.data.parametri.apriDocumentoCreato = response.ApriDocumentoCreato;
        // this.data.parametri.tipoDocumentoCodice = response.TipoDocumentoCodice;

        const combos = [
          {
            name: 'SpComboSezionale', aziendaId: this.data.parametri.aziendaId,
            param: `{"TipoDocumentoId":${response.tipoDocumentoId}}`
          },
        ];
        this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

        this.loading = false;
        if (this.orderList.length > 0) {
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
      this.modalOrdersSuppliersService.getModel(this.id).subscribe(
        (response: any) => {
          const _order = this.gridUtils.renameJson(response);
          this.item = _order;
          // this.data.item = _order;

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

  openChoiceModal(type) {
    let initialState = {};

    switch (type) {
      case 'fornitore':
        initialState = {
          model: type,
          nomeSp: 'SpComboFornitoreLookUp',
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

  onChangeContact(type, event) {
    switch (type) {
      case 'fornitore':
        this.data.parametri.fornitoreId = event?.contattoId || event?.contattoID;
        this.supplier = event;
        console.log('supplier', this.supplier);
        break;
      default:
        break;
    }
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
      this.data.testateList.push(this.item);
    }

    this.data.testateList = this.data.testateList.map(item => this.gridUtils.renameJson(item, false));
    this.data.dettagliList = this.data.dettagliList.map(item => this.gridUtils.renameJson(item, false));

    this.modalOrdersSuppliersService.create(this.data).subscribe(
      (response) => {
        const result = { openCreatedDocument: this.openCreatedDocument, response: response };
        this.onClose.next(result);
        this.closeModal();
        this.notificationService.success('APP.MESSAGE.create_orders_suppliers_successful', 'APP.TITLE.orders');
      },
      (error) => {
        this.notificationService.error('APP.MESSAGE.create_orders_suppliers_unsuccessful', 'APP.TITLE.orders');
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
    return !!params.data;
  }

  onGridReady(params) {
    this._gridApi = params.api;
    this._gridColumnApi = params.columnApi;

    this._gridApi.resetRowHeights();
  }

  onChangeIsFornitore() {
    if (this.data.parametri.isFornitoreDaArticolo) {
      this.data.parametri.fornitoreId = 0;
      this.supplier = null;
    }
  }
}
