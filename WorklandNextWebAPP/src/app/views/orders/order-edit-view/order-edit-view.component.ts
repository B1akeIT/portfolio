import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { concat, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { DialogService } from 'ngx-bootstrap-modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { TableModalService } from '@app/services/tables-modal.service';
import { TablesService } from '@app/views/tables/tables.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { OrdersService } from '../orders.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ModalContactComponent } from '@app/components/modal-contact/modal-contact.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';
import { ModalCopyComponent } from '@app/components/modal-copy/modal-copy.component';
import { ModalCreateDocComponent } from '../modal-create-doc/modal-create-doc.component';
import { ModalOrdersSuppliersComponent } from '../modal-orders-suppliers/modal-orders-suppliers.component';

import { Order } from '@app/models/order.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-order-edit-view',
  templateUrl: './order-edit-view.component.html',
  styleUrls: ['./order-edit-view.component.scss']
})
export class OrderEditViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() orderId = null;

  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() prev: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  model = 'order';

  order = null;

  user = null;

  form: FormGroup;

  loadingOptions = APP_CONST.loadingOptions;

  showJsonEditor = false; // APP_CONST.showJsonEditor;

  loading = false;

  isNew = this.orderId ? false : true;

  sidebarOpened = false;

  offsetLayout = '49px';

  originalOrder: Order = null;
  wOrder: Order = null;
  difference = null;

  tenant = null;

  modalEditTitle = '';
  currentType = '';

  loadings = [];

  anagrafiche = [];
  anagraficheCombo = [];

  otherLoading = false;
  nationLoading = false;
  nationId = null;

  modalTableRef: BsModalRef;
  currentTable = null;
  tables = null;
  tableSaveSubscription: Subscription;

  contacts$: Observable<any>;
  contactsLoading = false;
  contactsInput$ = new Subject<string>();
  selectedContacts: any;
  minLengthTerm = 3;
  minTranslateParams = { min: this.minLengthTerm };

  modalContactRef: BsModalRef;

  error: Boolean = false;
  errorMessage: string = '';

  modalChoiceRef: BsModalRef;
  modalPrintRef: BsModalRef;
  modalCopyRef: BsModalRef;
  modalCreateDocRef: BsModalRef;
  modalCreateOFRef: BsModalRef;

  current_tab = 'header';

  standardPanels: any[] = [
    { id: 1, key: 'header', title: 'APP.TAB.header', content: 'header', active: true, active_new: true, permission: 'PUBLIC' },
    { id: 2, key: 'body', title: 'APP.TAB.body', content: 'body', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 3, key: 'message', title: 'APP.TAB.message', content: 'message', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 4, key: 'footer', title: 'APP.TAB.footer', content: 'footer', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 5, key: 'other_data', title: 'APP.TAB.other_data', content: 'other_data', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 6, key: 'quotes', title: 'APP.TAB.order_quotes', content: 'quotes', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 7, key: 'orders-suppliers', title: 'APP.TAB.order_orders_suppliers', content: 'orders-suppliers', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 8, key: 'documents-processed', title: 'APP.TAB.documents_processed', content: 'documents-processed', active: true, active_new: false, permission: 'PUBLIC' },
  ];

  panels: any[] = this.standardPanels;
  showedPanels: any[] = [];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private dialogService: DialogService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private ordersService: OrdersService,
    private gridUtils: GridUtils,
    public tableMS: TableModalService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    // private formManager: FormManagerService,
  ) {
    this.editorOptions = new JsonEditorOptions();
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.editorOptions.mode = 'view'; // set only one mode

    this.tenant = this.authenticationService.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.tenant);

    this.anagrafiche['statoDocumento'] = APP_CONST.statoDocumento;

    this.tableSaveSubscription = this.tableMS.onSave.subscribe(
      (result: any) => {
        const updateTables = [result.table.api];
        this.utilsService.getAnagrafiche(updateTables, this.anagrafiche);
      }
    );
  }

  ngOnChanges(changes: any) {
    if (changes.orderId) {
      this.orderId = changes.orderId.currentValue;
      this.loadOrder();
    }
  }

  ngOnInit() {
    this.initData();

    this.loadContacts();
  }

  ngOnDestroy() {
    // this.tableSaveSubscription.unsubscrcdibe();
  }

  initShowedPanels() {
    this.panels.forEach(item => {
      if (this.authenticationService.hasPermission(item.permission)) {
        this.showedPanels.push(item);
      }
    });
  }

  initData() {
    this.user = this.authenticationService.getUserTenant();

    this._initCombo();
  }

  _initCombo() {
    const tables = [
      'AnagNazione',
      // 'AnagValuta',
      // 'AnagLingua',
      // 'AnagListino',
      // 'AnagOrigineContatto',
      // 'AnagIVA',
      // 'AnagTipoCliente',
      'AnagValutazione',
      // 'AnagTipoPagamento',
      // 'AnagCategoriaDocumento',
      // 'AnagMagazzino',
      // 'AnagDepartment',
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    const combos = [
      'SpComboValuta',
      'SpComboLingua',
      'SpComboListino',
      'SpComboIva',
      'SpComboTipoCliente',
      'SpComboTipoDocumento',
      'SpComboCategoriaDocumento',
      { name: 'SpComboMagazzino', aziendaId: this.user?.aziendaId },
      'SpComboDepartment',
      'SpComboUtente',
      'SpComboTipoPagamento',
      {
        name: 'SpComboSezionale', aziendaId: this.order.aziendaId,
        param: `{"TipoDocumentoId":${this.order.tipoDocumentoId}}`
      },
      'SpComboTipoDocumentoDiEvasione'
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

    if (this.isNew) {
      // empty order
      this.initShowedPanels();
      this.ordersService._getOrderDefaultValues(this.user.aziendaId).subscribe(
        (response: any) => {
          const _order = this.gridUtils.renameJson(response);
          this.order = new Order(_order);

          this.wOrder = JSON.parse(JSON.stringify(this.order));
          this.originalOrder = JSON.parse(JSON.stringify(this.order));

          const combos = [
            {
              name: 'SpComboStatoDocumento', aziendaId: this.order.aziendaId,
              param: `{"TipoDocumentoId":${this.order.tipoDocumentoId},"IsStatoTestata":true}`
            },
            {
              name: 'SpComboSezionale', aziendaId: this.order.aziendaId,
              param: `{"TipoDocumentoId":${this.order.tipoDocumentoId}}`
            },
          ];
          this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
        },
        (error: any) => {
          this.order = new Order({ aziendaId: this.user.aziendaId });

          this.wOrder = JSON.parse(JSON.stringify(this.order));
          this.originalOrder = JSON.parse(JSON.stringify(this.order));
        }
      );
    }
  }

  clearData() {
    this.order = null;
    this.loadings = [];
  }

  loadOrder() {
    this.error = false;
    if (this.orderId) {
      this.isNew = false;
      this.loading = true;
      // Get order
      this.ordersService.getModel(this.orderId).subscribe(
        (response: any) => {
          const _order = this.gridUtils.renameJson(response);
          this.order = _order;
          this.wOrder = new Order(_order);
          this.originalOrder = new Order(_order);
          this.modifiedModel(this.wOrder, this.originalOrder);
          this.isNew = this.order ? false : true;

          this.initShowedPanels();

          const combos = [
            {
              name: 'SpComboStatoDocumento', aziendaId: this.order.aziendaId,
              param: `{"TipoDocumentoId":${this.order.tipoDocumentoId},"IsStatoTestata":true}`
            },
            {
              name: 'SpComboSezionale', aziendaId: this.order.aziendaId,
              param: `{"TipoDocumentoId":${this.order.tipoDocumentoId}}`
            },
          ];
          this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
          this.error = true;
          this.errorMessage = error.message;
          this.notificationService.error(this.errorMessage, title);
        }
      );
    } else {
      this.clearData();
    }
  }

  onOrderBodySave(event) {
    this.wOrder = new Order(event.testata);
    this.originalOrder = new Order(event.testata);
    this.modifiedModel(this.wOrder, this.originalOrder);
    this.save.emit({ data: this.order, isNew: true });
  }

  onFormChanges($event) {
    this.modifiedModel(this.wOrder, this.originalOrder);
  }

  get modified() {
    return !_.isEmpty(this.difference);
  }

  prevElement(event) {
    this.next.emit({ data: this.order });
  }

  nextElement(event) {
    this.prev.emit({ data: this.order });
  }

  closeEdit(event?: any) {
    this.closed.emit({ element: this.order });
  }

  toggleSidebar($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.sidebarOpened = !this.sidebarOpened;
    this.eventsManagerService.broadcast(APP_CONST.toggleSidebarEvent, this.sidebarOpened);
  }

  onSelectMatTabChange(event) {
    this.current_tab = this.showedPanels[event.index].key;
  }

  isTabActive(tab) {
    return (tab === this.current_tab);
  }

  isTabDisabled(panel) {
    const disabled = panel.active_new ? false : (this.isNew ? true : !panel.active);
    return disabled;
  }

  saveEdit(event) {
    // const body = (event.data.id) ? event.difference : event.data;
    const body = this.wOrder;

    this.ordersService.saveOrder(this.wOrder.id, body).subscribe(
      (response: any) => {
        const _order = this.gridUtils.renameJson(response);
        this.order = _order;
        this.orderId = this.order.id;
        const orderData = JSON.parse(JSON.stringify(_order));
        this.wOrder = new Order(orderData);
        this.originalOrder = new Order(orderData);
        this.modifiedModel(this.wOrder, this.originalOrder);

        this.notificationService.saved();

        this.save.emit({ data: this.order, isNew: this.isNew });
        this.isNew = false;
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + (error.error.status_code || '');
        const message = error.error.Message || error.message;
        this.notificationService.error(message, title);
      }
    );
  }

  modifiedModel(obj1, obj2) {
    this.difference = this.utilsService.objectsDiff(obj1, obj2);
    return !_.isEmpty(this.difference);
  }

  isModifiedProperty(property) {
    return (this.difference && this.difference.hasOwnProperty(property));
  }

  // Utilities

  removeYesNo() {
    const title = this.translate.instant('APP.TITLE.delete');
    const message = this.translate.instant('APP.MESSAGE.are_you_sure');
    const cancelText = this.translate.instant('APP.BUTTON.cancel');
    const confirmText = this.translate.instant('APP.BUTTON.confirm');

    return this.dialogService.confirm(title, message, {
      cancelButtonText: cancelText,
      cancelButtonClass: 'btn-light btn-sm',
      confirmButtonText: confirmText,
      confirmButtonClass: 'btn-danger btn-sm',
      backdrop: 'static'
    });
  }

  customSearchFn(term, item) {
    term = term.toLowerCase();
    return item.descrizione.toLowerCase().indexOf(term) > -1;
  }

  onChangeNazione(event) {
    this.onFormChanges(event);
  }

  onChangeModal(type, event) {
    switch (type) {
      case 'intestatario':
        this.wOrder.clienteIntestatarioId = event?.contattoId;
        this.wOrder.contattoIntestatarioId = event?.contattoId;
        this.wOrder.nominativoIntestatario = event?.ragioneSociale;
        this.wOrder.indirizzoIntestatario = event?.indirizzo;
        this.wOrder.comuneIntestatario = event?.comune;
        this.wOrder.provinciaIntestatario = event?.provincia;
        this.wOrder.capIntestatario = event?.cap;
        this.wOrder.nazioneIntestatario = event?.nazione;
        this.wOrder.nazioneIntestatarioId = event?.anagNazione;
        this.wOrder.codiceFiscale = event?.codiceFiscale;
        this.wOrder.pIVA = event?.pIva;
        if (event?.contattoDestinazioneId) {
          this.wOrder.contattoDestinazioneId = event?.contattoDestinazioneId;
          this.wOrder.nominativoDestinazione = event?.nominativoDestinazione;
          this.wOrder.indirizzoDestinazione = event?.indirizzoDestinazione;
          this.wOrder.comuneDestinazione = event?.comuneDestinazione;
          this.wOrder.provinciaDestinazione = event?.provinciaDestinazione;
          this.wOrder.capDestinazione = event?.capDestinazione;
          this.wOrder.nazioneDestinazione = event?.nazioneDestinazione;
          this.wOrder.nazioneDestinazioneId = event?.nazioneDestinazioneId;
        }
        if (this.wOrder.isStessoFatturazione) {
          this.wOrder.anagTipoPagamentoId = event?.anagTipoPagamentoId;
          this.wOrder.listinoId = event?.listinoId;
        }
        break;
      case 'fatturazione':
        this.wOrder.clienteFatturazioneId = event?.contattoId;
        this.wOrder.contattoFatturazioneId = event?.contattoId;
        this.wOrder.nominativoFatturazione = event?.ragioneSociale;
        this.wOrder.indirizzoFatturazione = event?.indirizzo;
        this.wOrder.comuneFatturazione = event?.comune;
        this.wOrder.provinciaFatturazione = event?.provincia;
        this.wOrder.capFatturazione = event?.cap;
        this.wOrder.nazioneFatturazione = event?.nazione;
        this.wOrder.nazioneFatturazioneId = event?.anagNazione;
        // Pagamento
        this.wOrder.anagTipoPagamentoId = event?.anagTipoPagamentoId;
        this.wOrder.listinoId = event?.listinoId;
        break;
      case 'destinazione':
        this.wOrder.contattoDestinazioneId = event?.contattoId;
        this.wOrder.nominativoDestinazione = event?.ragioneSociale;
        this.wOrder.indirizzoDestinazione = event?.indirizzo;
        this.wOrder.comuneDestinazione = event?.comune;
        this.wOrder.provinciaDestinazione = event?.provincia;
        this.wOrder.capDestinazione = event?.cap;
        this.wOrder.nazioneDestinazione = event?.nazione;
        this.wOrder.nazioneDestinazioneId = event?.anagNazione;
        break;
      case 'sezionale':
        this.wOrder.sezionaleId = event?.id;
        // this.wOrder.sezionaleDescrizione = event?.value;
        break;
      case 'vettore':
        this.wOrder.vettoreId = event?.contattoId || event?.contattoID;
        this.wOrder.nominativoVettore = event?.ragioneSociale;
        break;
      default:
        break;
    }
    this.onFormChanges(event);
  }

  // https://www.freakyjolly.com/ng-select-typeahead-with-debouncetime-fetch-server-response/

  trackByContacts(item: any) {
    return item.id;
  }

  loadContacts() {
    this.contacts$ = concat(
      of([]), // default items
      this.contactsInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.contactsLoading = true),
        switchMap(term => {
          return this.ordersService.getContacts(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.contactsLoading = false)
          );
        })
      )
    );
  }

  showContact(id, title) {
    const initialState = {
      contactId: id,
      contactTitle: title,
      showHeader: false,
      showFooter: false
    };
    this.modalContactRef = this.modalService.show(ModalContactComponent, {
      ignoreBackdropClick: true,
      class: 'modal-lg-full',
      initialState: initialState
    });
    this.modalContactRef.content.onClose.subscribe(
      (result: any) => {
        // console.log('showContact close', result);
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

  openChoiceModal(type) {
    let initialState = {};

    let _modalClass = 'modal-lg-full';

    switch (type) {
      case 'intestatario':
        initialState = {
          model: type,
          nomeSp: 'SpComboContattoLookUp',
          item: this.wOrder,
          searchTerm: this.wOrder.nominativoIntestatario
        };
        break;
      case 'fatturazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboClienteLookUp',
          item: this.wOrder,
          searchTerm: this.wOrder.nominativoFatturazione
        };
        break;
      case 'destinazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboDestinazioneLookUp',
          item: this.wOrder,
          searchTerm: this.wOrder.nominativoDestinazione
        };
        break;
      case 'sezionale':
        _modalClass = 'modal-lg-full';
        initialState = {
          model: type,
          nomeSp: 'SpComboSezionaleLookUp',
          item: this.wOrder,
          searchTerm: this.wOrder.nominativoDestinazione
        };
        break;
      case 'vettore':
        initialState = {
          model: type,
          nomeSp: 'SpComboVettoreLookUp',
          item: this.wOrder,
          searchTerm: ''
          };
        break;
      }

    this.modalChoiceRef = this.modalService.show(ModalLookupComponent, {
      ignoreBackdropClick: true,
      class: _modalClass,
      initialState: initialState
    });
    this.modalChoiceRef.content.onClose.subscribe(
      (result: any) => {
        const _result = this._fixKeys(result);

        this.onChangeModal(type, _result);
      }
    );
  }

  onCopy() {
    if (this.orderId) {
      const initialState = {
        id: this.orderId,
        model: 'order',
        item: this.order
      };

      this.modalCopyRef = this.modalService.show(ModalCopyComponent, {
        id: 9990,
        ignoreBackdropClick: false,
        class: 'modal-lg',
        initialState: initialState
      });
      this.modalCopyRef.content.onClose.subscribe(
        (result: any) => {
          // console.log('modal result', result);
        }
      );
    } else {
      console.log('onCopy', 'Select element');
    }
  }

  onMenuDocument(doc: any) {
    // this.notificationService.info(`${doc.id} - ${doc.descrizione}`, 'Genera documento');
    this.onCreateDoc(doc.id, doc.descrizione);
  }

  onCreateDoc(type: number, description: string) {
    if (this.orderId > 0) {
      const initialState = {
        id: this.orderId,
        model: 'order',
        document: type,
        documentDescription: description,
        item: this.order,
        orderList: []
      };

      this.modalCreateDocRef = this.modalService.show(ModalCreateDocComponent, {
        id: 9990,
        ignoreBackdropClick: false,
        class: 'modal-lg-full',
        initialState: initialState
      });
      this.modalCreateDocRef.content.onClose.subscribe(
        (result: any) => {
          this.notificationService.success('APP.MESSAGE.create_document_successful', 'APP.TITLE.orders');
        },
        (error: any) => {
          this.notificationService.success('APP.MESSAGE.create_document_unsuccessful', 'APP.TITLE.orders');
        }
      );
    } else {
      console.log('onCreateDoc', 'Select element');
    }
  }

  onCreateOrderSupplier(type: number, description: string) {
    if (this.orderId > 0) {
      const initialState = {
        id: this.orderId,
        model: 'order',
        document: type,
        documentDescription: description,
        item: this.order,
        orderList: []
      };

      this.modalCreateOFRef = this.modalService.show(ModalOrdersSuppliersComponent, {
        id: 9990,
        ignoreBackdropClick: false,
        class: 'modal-lg-full',
        initialState: initialState
      });
      this.modalCreateOFRef.content.onClose.subscribe(
        (result: any) => {
          // Done
        }
      );
    } else {
      console.log('onCreateOrderSupplier', 'Select element');
    }
  }

  onDelete(confirm) {
    if (confirm) {
      this.ordersService.deleteModel(this.orderId).subscribe(
        (response: any) => {
          this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.orders');
          this.save.emit({ data: this.order, isNew: true });
          this.closeEdit();
        },
        (error: any) => {
          // console.log('onDelete error', error);
          this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.orders');
          if (error.error && error.error.Message) {
            this.notificationService.error(error.error.Message, 'APP.TITLE.orders');
          }
        }
      );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.orders');
    }
  }
}
