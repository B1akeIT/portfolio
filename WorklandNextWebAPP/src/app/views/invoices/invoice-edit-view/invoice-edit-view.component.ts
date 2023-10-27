import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
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
import { InvoicesService } from '../invoices.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ScadenzeComponent } from '../scadenze/scadenze.component';
import { InvoiceBodyComponent } from '../invoice-body/invoice-body.component';

import { ModalContactComponent } from '@app/components/modal-contact/modal-contact.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';
import { ModalCopyComponent } from '@app/components/modal-copy/modal-copy.component';
import { ModalConfirmComponent } from '@app/components/modal-confirm/modal-confirm.component';

import { ModalGeneraNcComponent } from '../modal-genera-nc/modal-genera-nc.component';

import { Invoice } from '@app/models/invoice.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-invoice-edit-view',
  templateUrl: './invoice-edit-view.component.html',
  styleUrls: ['./invoice-edit-view.component.scss']
})
export class InvoiceEditViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() invoiceId = null;
  @Input() invoiceType: any = null;

  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() prev: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  @ViewChild('scadenzeComponent', { static: false }) scadenzeComponent: ScadenzeComponent;
  @ViewChild('invoiceBodyComponent', { static: false }) invoiceBodyComponent: InvoiceBodyComponent;

  model = 'invoice';

  invoice = null;

  user = null;

  form: FormGroup;

  loadingOptions = APP_CONST.loadingOptions;

  showJsonEditor = false; // APP_CONST.showJsonEditor;

  loading = false;

  isNew = true;

  sidebarOpened = false;

  offsetLayout = '49px';

  originalInvoice: Invoice = null;
  wInvoice: Invoice = null;
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

  current_tab = 'header';

  standardPanels: any[] = [
    { id: 1, key: 'header', title: 'APP.TAB.header', content: 'header', active: true, active_new: true, permission: 'PUBLIC' },
    { id: 2, key: 'body', title: 'APP.TAB.body', content: 'body', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 3, key: 'footer', title: 'APP.TAB.footer', content: 'footer', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 4, key: 'other_data', title: 'APP.TAB.other_data', content: 'other_data', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 5, key: 'quotes', title: 'APP.TAB.order_quotes', content: 'quotes', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 6, key: 'orders', title: 'APP.TAB.client_orders', content: 'orders', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 7, key: 'orders-suppliers', title: 'APP.TAB.orders_suppliers', content: 'orders-suppliers', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 8, key: 'ddt', title: 'APP.TAB.ddt', content: 'ddt', active: true, active_new: false, permission: 'PUBLIC' },
    // { id: 9, key: 'warehouse-movements', title: 'APP.TAB.warehouse_movements', content: 'warehouse-movements', active: true, active_new: false, permission: 'PUBLIC' },
  ];

  panels: any[] = this.standardPanels;
  showedPanels: any[] = [];

  _doneRecalculate = false;

  modalConfirmRef: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private dialogService: DialogService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private invoicesService: InvoicesService,
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
  }

  ngOnChanges(changes: any) {
    if (changes.invoiceId) {
      this.invoiceId = changes.invoiceId.currentValue;
      this.loadInvoice();
    }
  }

  ngOnInit() {
    this.initData();

    this.loadContacts();

    if (this.isNew) {
      this.initShowedPanels();
      this.invoicesService._getOrderDefaultValues(this.user.aziendaId, this.invoiceType.id).subscribe(
        (response: any) => {
          const _invoice = this.gridUtils.renameJson(response);
          this.invoice = new Invoice(_invoice);

          this.wInvoice = JSON.parse(JSON.stringify(this.invoice));
          this.originalInvoice = JSON.parse(JSON.stringify(this.invoice));

          const combos = [
            { name: 'SpComboMagazzino', aziendaId: this.invoice.aziendaId },
            {
              name: 'SpComboStatoDocumento', aziendaId: this.invoice.aziendaId,
              param: `{"TipoDocumentoId":${this.invoice.tipoDocumentoId},"IsStatoTestata":true}`
            },
            {
              name: 'SpComboSezionale', aziendaId: this.invoice.aziendaId,
              param: `{"TipoDocumentoId":${this.invoice.tipoDocumentoId}}`
            },
          ];
          this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
        },
        (error: any) => {
          this.invoice = new Invoice({ aziendaId: this.user.aziendaId });

          this.wInvoice = JSON.parse(JSON.stringify(this.invoice));
          this.originalInvoice = JSON.parse(JSON.stringify(this.invoice));
        }
      );
    }
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
    const combos = [
      'SpComboNazione',
      'SpComboValuta',
      'SpComboLingua',
      'SpComboListino',
      'SpComboIva',
      'SpComboTipoCliente',
      'SpComboTipoDocumento',
      'SpComboCategoriaDocumento',
      'SpComboDepartment',
      'SpComboValutazione',
      'SpComboBancaAzienda',
      'SpComboTipoPagamento',
      'SpComboDepartment',
      // 'SpComboTipoCliente',
      'SpComboCausaleTrasporto',
      'SpComboTrasportoACuraDel',
      'SpComboAspettoEsterioreArticolo',
      'SpComboPorto',
      'SpComboTipoFattura',
];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

    this.tableSaveSubscription = this.tableMS.onSave.subscribe(
      (result: any) => {
        const updateTables = [result.table.api];
        this.utilsService.getAnagrafiche(updateTables, this.anagrafiche);
      }
    );
  }

  clearData() {
    this.invoice = null;
    this.loadings = [];
  }

  loadInvoice() {
    this.error = false;
    if (this.invoiceId) {
      this.isNew = false;
      this.loading = true;
      // Get invoice
      this.invoicesService.getModel(this.invoiceId).subscribe(
        (response: any) => {
          const _invoice = this.gridUtils.renameJson(response);
          this.invoice = _invoice;
          this.wInvoice = new Invoice(_invoice);
          this.originalInvoice = new Invoice(_invoice);
          this.modifiedModel(this.wInvoice, this.originalInvoice);
          this.isNew = this.invoice ? false : true;

          this.initShowedPanels();

          const combos = [
            { name: 'SpComboMagazzino', aziendaId: this.invoice.aziendaId },
            {
              name: 'SpComboStatoDocumento', aziendaId: this.invoice.aziendaId,
              param: `{"TipoDocumentoId":${this.invoice.tipoDocumentoId},"IsStatoTestata":true}`
            },
            {
              name: 'SpComboSezionale', aziendaId: this.invoice.aziendaId,
              param: `{"TipoDocumentoId":${this.invoice.tipoDocumentoId}}`
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

  onInvoiceBodySave(event) {
    this.onInvoiceBodyModify(event);
    this.save.emit({ data: this.invoice, isNew: true });
  }

  onInvoiceBodyDelete(event) {
    this.onInvoiceBodyModify(event);
  }

  onInvoiceBodyModify(event) {
    this.wInvoice = new Invoice(event.testata);
    this.originalInvoice = new Invoice(event.testata);
    this.modifiedModel(this.wInvoice, this.originalInvoice);
  }

  onFormChanges($event) {
    this.modifiedModel(this.wInvoice, this.originalInvoice);
  }

  get modified() {
    return !_.isEmpty(this.difference);
  }

  prevElement(event) {
    this.next.emit({ data: this.invoice });
  }

  nextElement(event) {
    this.prev.emit({ data: this.invoice });
  }

  closeEdit(event) {
    this.closed.emit({ element: this.invoice });
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

  _confirmRecalculate(event) {
    // Controllare se esistono scadenze manuali
    const _manualDeadlines = true;
    if (!this._doneRecalculate && _manualDeadlines) {
      // Se esistono chiedere se si vuole ricalcolarle oppure no
      const initialState = {
        title: this.translate.instant('APP.TITLE.confirm'),
        message: this.translate.instant('APP.MESSAGE.recalculate'),
        cancelText: this.translate.instant('APP.BUTTON.cancel'),
        confirmText: this.translate.instant('APP.BUTTON.confirm')
      };

      this.modalConfirmRef = this.modalService.show(ModalConfirmComponent, {
        ignoreBackdropClick: true,
        initialState: initialState
      });
      this.modalConfirmRef.content.onClose.subscribe(
        (response: any) => {
          // console.log('_confirmRecalculate', response);
          // this._doneRecalculate = true;
          this.saveEdit(event, response);
        }
      );
    } else {
      this.saveEdit(event);
    }
  }

  saveEdit(event, recalculate = false) {
    // const body = (event.data.id) ? event.difference : event.data;
    const body = this.wInvoice;

    this.invoicesService.saveInvoice(this.wInvoice.id, body, recalculate).subscribe(
      (response: any) => {
        const _invoice = this.gridUtils.renameJson(response);
        this.invoice = _invoice;
        this.invoiceId = this.invoice.id;
        const invoiceData = JSON.parse(JSON.stringify(response));
        this.wInvoice = new Invoice(invoiceData);
        this.originalInvoice = new Invoice(invoiceData);
        this.modifiedModel(this.wInvoice, this.originalInvoice);

        this.notificationService.saved();

        this.save.emit({ data: this.invoice, isNew: this.isNew });
        this.isNew = false;
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
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

  onChangeContact(type, event) {
    switch (type) {
      case 'intestatario':
        this.wInvoice.clienteIntestatarioId = event?.contattoId;
        this.wInvoice.contattoIntestatarioId = event?.contattoId;
        this.wInvoice.nominativoIntestatario = event?.ragioneSociale;
        this.wInvoice.indirizzoIntestatario = event?.indirizzo;
        this.wInvoice.comuneIntestatario = event?.comune;
        this.wInvoice.provinciaIntestatario = event?.provincia;
        this.wInvoice.capIntestatario = event?.cap;
        this.wInvoice.nazioneIntestatario = event?.nazione;
        this.wInvoice.nazioneIntestatarioId = event?.anagNazione;
        this.wInvoice.codiceFiscale = event?.codiceFiscale;
        this.wInvoice.pIVA = event?.pIva;
        break;
      case 'fatturazione':
        this.wInvoice.clienteFatturazioneId = event?.contattoId;
        this.wInvoice.contattoFatturazioneId = event?.contattoId;
        this.wInvoice.nominativoFatturazione = event?.ragioneSociale;
        this.wInvoice.indirizzoFatturazione = event?.indirizzo;
        this.wInvoice.comuneFatturazione = event?.comune;
        this.wInvoice.provinciaFatturazione = event?.provincia;
        this.wInvoice.capFatturazione = event?.cap;
        this.wInvoice.nazioneFatturazione = event?.nazione;
        this.wInvoice.nazioneFatturazioneId = event?.anagNazione;
        this.wInvoice.codiceFiscale = event?.codiceFiscale;
        this.wInvoice.pIVA = event?.pIva;
        this.wInvoice.anagValutazioneColore = event?.anagValutazioneColore;
        this.wInvoice.anagValutazioneDescrizione = event?.anagValutazioneDescrizione;
        this.wInvoice.anagValutazioneIsEvidenzia = event?.anagValutazioneIsEvidenzia;
        break;
      case 'destinazione':
        this.wInvoice.contattoDestinazioneId = event?.contattoId;
        this.wInvoice.nominativoDestinazione = event?.ragioneSociale;
        this.wInvoice.indirizzoDestinazione = event?.indirizzo;
        this.wInvoice.comuneDestinazione = event?.comune;
        this.wInvoice.provinciaDestinazione = event?.provincia;
        this.wInvoice.capDestinazione = event?.cap;
        this.wInvoice.nazioneDestinazione = event?.nazione;
        this.wInvoice.nazioneDestinazioneId = event?.anagNazione;
        break;
      case 'vettore':
        this.wInvoice.vettoreId = event?.contattoId || event?.contattoID;
        this.wInvoice.nominativoVettore = event?.ragioneSociale;
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
          return this.invoicesService.getContacts(term).pipe(
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

    switch (type) {
      case 'intestatario':
        initialState = {
          model: type,
          nomeSp: 'SpComboContattoLookUp',
          item: this.wInvoice,
          searchTerm: this.wInvoice.nominativoIntestatario
        };
        break;
      case 'fatturazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboClienteLookUp',
          item: this.wInvoice,
          searchTerm: this.wInvoice.nominativoFatturazione
        };
        break;
      case 'destinazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboDestinazioneLookUp',
          item: this.wInvoice,
          searchTerm: this.wInvoice.nominativoDestinazione
        };
        break;
      case 'vettore':
        initialState = {
          model: type,
          nomeSp: 'SpComboVettoreLookUp',
          item: this.wInvoice,
          searchTerm: ''
        };
        break;
    }

    this.modalChoiceRef = this.modalService.show(ModalLookupComponent, {
      ignoreBackdropClick: true,
      class: 'modal-lg-full',
      initialState: initialState
    });
    this.modalChoiceRef.content.onClose.subscribe(
      (result: any) => {
        const _result = this._fixKeys(result);

        this.onChangeContact(type, _result);
      }
    );
  }

  onCopy() {
    if (this.invoiceId) {
      const initialState = {
        id: this.invoiceId,
        model: 'invoice',
        item: this.invoice
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

  onGeneraNC() {
    console.log('onGeneraNC', this.invoice);
    if (this.invoice) {
      const initialState = {
        id: this.invoiceId,
        model: 'invoice',
        item: this.invoice
      };

      this.modalCopyRef = this.modalService.show(ModalGeneraNcComponent, {
        id: 9990,
        ignoreBackdropClick: false,
        class: 'modal-lg-full',
        initialState: initialState
      });
      this.modalCopyRef.content.onClose.subscribe(
        (result: any) => {
          // console.log('modal result', result);
        }
      );
    } else {
      console.log('onGeneraNC', 'Select element');
    }
  }

  _reloadScadenze() {
    if (this.scadenzeComponent) {
      this.scadenzeComponent.refresh();
    }
  }

  _getTotaleScadenze() {
    if (this.scadenzeComponent) {
      return this.scadenzeComponent.getTotals();
    }
    return 0;
  }

  _getDifference() {
    const _diff = this.wInvoice.totaleNetto - this._getTotaleScadenze();
    return _diff;
  }

  isReadOnly() {
    return this.wInvoice?.isReadOnly;
  }

  onDelete(confirm) {
    if (confirm) {
      this.invoicesService.deleteModel(this.invoiceId).subscribe(
        (response: any) => {
          this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.invoice');
          this.save.emit({ data: this.invoice, isNew: true });
          this.closeEdit(null);
        },
        (error: any) => {
          // console.log('onDelete error', error);
          this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.invoice');
          if (error.error && error.error.Message) {
            this.notificationService.error(error.error.Message, 'APP.TITLE.invoice');
          }
        }
      );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.invoice');
    }
  }
}
