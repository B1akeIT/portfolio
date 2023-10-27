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
import { QuotesService } from '../quotes.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ModalContactComponent } from '@app/components/modal-contact/modal-contact.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';
import { ModalCreateOrderComponent } from '../modal-create-order/modal-create-order.component';
import { ModalCopyComponent } from '@app/components/modal-copy/modal-copy.component';

import { Quote } from '@app/models/quote.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-quote-edit-view',
  templateUrl: './quote-edit-view.component.html',
  styleUrls: ['./quote-edit-view.component.scss']
})
export class QuoteEditViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() quoteId = null;

  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() prev: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  model = 'quote';

  isNew = this.quoteId ? false : true;
  quote = null;

  user = null;

  form: FormGroup;

  loadingOptions = APP_CONST.loadingOptions;

  showJsonEditor = false; // APP_CONST.showJsonEditor;

  loading = false;

  sidebarOpened = false;

  offsetLayout = '49px';

  originalQuote: Quote = null;
  wQuote: Quote = null;
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

  modalCreateOrdertRef: BsModalRef;
  modalCopyRef: BsModalRef;
  modalChoiceRef: BsModalRef;

  current_tab = 'header';

  standardPanels: any[] = [
    { id: 1, key: 'header', title: 'APP.TAB.header', content: 'header', active: true, active_new: true, permission: 'PUBLIC' },
    { id: 2, key: 'body', title: 'APP.TAB.body', content: 'body', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 3, key: 'message', title: 'APP.TAB.message', content: 'message', active: true, active_new: true, permission: 'PUBLIC' },
    { id: 4, key: 'footer', title: 'APP.TAB.footer', content: 'footer', active: true, active_new: true, permission: 'PUBLIC' },
    { id: 5, key: 'other_data', title: 'APP.TAB.other_data', content: 'other_data', active: true, active_new: true, permission: 'PUBLIC' },
    { id: 6, key: 'orders', title: 'APP.TITLE.client_orders', content: 'orders', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 7, key: 'orders-suppliers', title: 'APP.TITLE.client_orders_suppliers', content: 'orders-suppliers', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 8, key: 'documents-processed', title: 'APP.TITLE.documents_processed', content: 'documents-processed', active: true, active_new: false, permission: 'PUBLIC' },
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
    private quotesService: QuotesService,
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
    if (changes.quoteId) {
      this.quoteId = changes.quoteId.currentValue;
      this.loadQuote();
    }
  }

  ngOnInit() {
    this.initData();

    this.loadContacts();

    if (this.isNew) {
      // empty quote
      this.initShowedPanels();
      this.quotesService._getQuoteDefaultValues(this.user.aziendaId).subscribe(
        (response: any) => {
          const _quote = this.gridUtils.renameJson(response);
          this.quote = new Quote(_quote);

          this.wQuote = JSON.parse(JSON.stringify(this.quote));
          this.originalQuote = JSON.parse(JSON.stringify(this.quote));
        },
        (error: any) => {
          this.quote = new Quote({ aziendaId: this.user.aziendaId });

          this.wQuote = JSON.parse(JSON.stringify(this.quote));
          this.originalQuote = JSON.parse(JSON.stringify(this.quote));
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
      'SpComboDepartment',
      'SpComboUtente',
      'SpComboTipoPagamento'
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

    this.anagrafiche['statoDocumento'] = APP_CONST.statoDocumento;

    this.tableSaveSubscription = this.tableMS.onSave.subscribe(
      (result: any) => {
        const updateTables = [result.table.api];
        this.utilsService.getAnagrafiche(updateTables, this.anagrafiche);
      }
    );
  }

  clearData() {
    this.quote = null;
    this.loadings = [];
  }

  loadQuote() {
    this.error = false;
    if (this.quoteId) {
      this.isNew = false;
      this.loading = true;
      // Get quote
      this.quotesService.getModel(this.quoteId).subscribe(
        (response: any) => {
          const _quote = this.gridUtils.renameJson(response);
          this.quote = _quote;
          this.wQuote = new Quote(_quote);
          this.originalQuote = new Quote(_quote);
          this.modifiedModel(this.wQuote, this.originalQuote);
          this.isNew = this.quote ? false : true;

          this.initShowedPanels();

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

  onQuoteBodySave(event) {
    this.onQuoteBodyModify(event);
  }

  onQuoteBodyDelete(event) {
    this.onQuoteBodyModify(event);
  }

  onQuoteBodyModify(event) {
    this.wQuote = new Quote(event.testata);
    this.originalQuote = new Quote(event.testata);
    this.modifiedModel(this.wQuote, this.originalQuote);
  }

  onFormChanges($event) {
    this.modifiedModel(this.wQuote, this.originalQuote);
  }

  onChangeField(field, value) {
    console.log('onChangeField', field, value);
  }

  get modified() {
    return !_.isEmpty(this.difference);
  }

  prevElement(event) {
    this.next.emit({ data: this.quote });
  }

  nextElement(event) {
    this.prev.emit({ data: this.quote });
  }

  closeEdit(event?: any) {
    this.closed.emit({ element: this.quote });
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
    const body = this.wQuote;

    this.quotesService.saveQuote(this.wQuote.id, body).subscribe(
      (response: any) => {
        const _quote = this.gridUtils.renameJson(response);
        this.quote = _quote;
        this.quoteId = this.quote.id;
        this.wQuote = new Quote(_quote);
        this.originalQuote = new Quote(_quote);
        this.modifiedModel(this.wQuote, this.originalQuote);

        this.notificationService.saved();

        this.save.emit({ data: this.quote, isNew: this.isNew });
        this.isNew = false;
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error'); // + ' ' + error.error.status_code;
        let message = error.message;
        if (error.error && error.error.Message) {
          message = error.error.Message;
        }
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

  onChangeDepartment(event) {
    const _idx = this.anagraficheCombo['SpComboDepartment'].findIndex((dep: any) => {
      return (Number(dep.id) === Number(this.wQuote.anagDepartmentId));
    });
    this.wQuote.categoriaDocumentoId = this.anagraficheCombo['SpComboDepartment'][_idx].categoriaDocumentoId;
  }

  onChangeContact(type, event) {
    switch (type) {
      case 'intestatario':
        this.wQuote.contattoIntestatarioId = event?.contattoId;
        this.wQuote.nominativoIntestatario = event?.ragioneSociale;
        this.wQuote.indirizzoIntestatario = event?.indirizzo;
        this.wQuote.comuneIntestatario = event?.comune;
        this.wQuote.provinciaIntestatario = event?.provincia;
        this.wQuote.capIntestatario = event?.cap;
        this.wQuote.nazioneIntestatario = event?.nazione;
        this.wQuote.nazioneIntestatarioId = event?.anagNazione;
        this.wQuote.codiceFiscale = event?.codiceFiscale;
        this.wQuote.piva = event?.pIva;
        this.wQuote.clienteProprietarioId = event?.clienteProprietarioId;
        this.wQuote.nominativoProprietario = event?.nominativoProprietario;
        if (event?.contattoDestinazioneId) {
          this.wQuote.contattoDestinazioneId = event?.contattoDestinazioneId;
          this.wQuote.nominativoDestinazione = event?.nominativoDestinazione;
          this.wQuote.indirizzoDestinazione = event?.indirizzoDestinazione;
          this.wQuote.comuneDestinazione = event?.comuneDestinazione;
          this.wQuote.provinciaDestinazione = event?.provinciaDestinazione;
          this.wQuote.capDestinazione = event?.capDestinazione;
          this.wQuote.nazioneDestinazione = event?.nazioneDestinazione;
          this.wQuote.nazioneDestinazioneId = event?.nazioneDestinazioneId;
        }
        if (this.wQuote.isStessoFatturazione) {
          this.wQuote.anagTipoPagamentoId = event?.anagTipoPagamentoId;
          this.wQuote.listinoId = event?.listinoId;
        }
        break;
      case 'fatturazione':
        this.wQuote.clienteFatturazioneId = event?.clienteId;
        this.wQuote.contattoFatturazioneId = event?.contattoId;
        this.wQuote.nominativoFatturazione = event?.ragioneSociale;
        this.wQuote.indirizzoFatturazione = event?.indirizzo;
        this.wQuote.comuneFatturazione = event?.comune;
        this.wQuote.provinciaFatturazione = event?.provincia;
        this.wQuote.capFatturazione = event?.cap;
        this.wQuote.nazioneFatturazione = event?.nazione;
        this.wQuote.nazioneFatturazioneId = event?.anagNazione;
        // Pagamento
        this.wQuote.anagTipoPagamentoId = event?.anagTipoPagamentoId;
        this.wQuote.listinoId = event?.listinoId;
        break;
      case 'destinazione':
        this.wQuote.contattoDestinazioneId = event?.contattoId;
        this.wQuote.nominativoDestinazione = event?.ragioneSociale;
        this.wQuote.indirizzoDestinazione = event?.indirizzo;
        this.wQuote.comuneDestinazione = event?.comune;
        this.wQuote.provinciaDestinazione = event?.provincia;
        this.wQuote.capDestinazione = event?.cap;
        this.wQuote.nazioneDestinazione = event?.nazione;
        this.wQuote.nazioneDestinazioneId = event?.anagNazione;
        break;
      case 'vettore':
        this.wQuote.vettoreId = event?.contattoId || event?.contattoID;
        this.wQuote.nominativoVettore = event?.ragioneSociale;
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
          return this.quotesService.getContacts(term).pipe(
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

  openChoiceModal(type) {
    let initialState = {};

    switch (type) {
      case 'intestatario':
        initialState = {
          model: type,
          nomeSp: 'SpComboContattoLookUp',
          item: this.wQuote,
          searchTerm: this.wQuote.nominativoIntestatario
        };
        break;
      case 'fatturazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboClienteLookUp',
          item: this.wQuote,
          searchTerm: this.wQuote.nominativoFatturazione
        };
        break;
      case 'destinazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboDestinazioneLookUp',
          item: this.wQuote,
          searchTerm: this.wQuote.nominativoDestinazione
        };
        break;
      case 'vettore':
        initialState = {
          model: type,
          nomeSp: 'SpComboVettoreLookUp',
          item: this.wQuote,
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
        const _result = this.gridUtils.renameJson(result);
        this.onChangeContact(type, _result);
      }
    );
  }

  onCreateOrder() {
    if (this.quoteId) {
      const initialState = {
        id: this.quoteId,
        model: 'quote',
        item: this.quote
      };

      this.modalCreateOrdertRef = this.modalService.show(ModalCreateOrderComponent, {
        id: 9990,
        ignoreBackdropClick: false,
        class: 'modal-lg-full',
        initialState: initialState
      });
      this.modalCreateOrdertRef.content.onClose.subscribe(
        (result: any) => {
          // console.log('modal result', result);
          this.notificationService.success('APP.MESSAGE.generation_order_successful', 'APP.TITLE.quotes');
        },
        (error: any) => {
          this.notificationService.error('APP.MESSAGE.generation_order_unsuccessful', 'APP.TITLE.quotes');
          if (error.error && error.error.Message) {
            this.notificationService.error(error.error.Message, 'APP.TITLE.quotes');
          }
        }
      );
    } else {
      console.log('onCreateOrder', 'Select element');
    }
  }

  onCopy() {
    if (this.quoteId) {
      const initialState = {
        id: this.quoteId,
        model: 'quote',
        item: this.quote
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
          this.notificationService.success('APP.MESSAGE.copy_order_successful', 'APP.TITLE.quotes');
        },
        (error: any) => {
          this.notificationService.error('APP.MESSAGE.copy_unsuccessful', 'APP.TITLE.quotes');
          if (error.error && error.error.Message) {
            this.notificationService.error(error.error.Message, 'APP.TITLE.quotes');
          }
        }
      );
    } else {
      console.log('onCopy', 'Select element');
    }
  }

  isClient() {
    return this.wQuote ? true : false;
  }

  onDelete(confirm) {
    if (confirm) {
      this.quotesService.deleteModel(this.quoteId).subscribe(
        (response: any) => {
          this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.quotes');
          this.save.emit({ data: this.quote, isNew: true });
          this.closeEdit();
        },
        (error: any) => {
          // console.log('onDelete error', error);
          this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.quotes');
          if (error.error && error.error.Message) {
            this.notificationService.error(error.error.Message, 'APP.TITLE.quotes');
          }
        }
      );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.quotes');
    }
  }
}
