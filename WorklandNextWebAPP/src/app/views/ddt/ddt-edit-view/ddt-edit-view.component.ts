import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, SimpleChanges } from '@angular/core';
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
import { DdtService } from '../ddt.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ModalContactComponent } from '@app/components/modal-contact/modal-contact.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';
import { ModalCopyComponent } from '@app/components/modal-copy/modal-copy.component';
import { ModalChargeWarehouseComponent } from '@app/components/modal-charge-warehouse/modal-charge-warehouse.component';

import { Ddt } from '@app/models/ddt.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-ddt-edit-view',
  templateUrl: './ddt-edit-view.component.html',
  styleUrls: ['./ddt-edit-view.component.scss']
})
export class DdtEditViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() ddtId: number = null;
  @Input() ddtType: any = null;

  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() prev: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  model = 'ddt';

  ddt = null;

  user = null;

  form: FormGroup;

  loadingOptions = APP_CONST.loadingOptions;

  showJsonEditor = false; // APP_CONST.showJsonEditor;

  loading = false;

  isNew = this.ddtId ? false : true;

  sidebarOpened = false;

  offsetLayout = '49px';

  originalDdt: Ddt = null;
  wDdt: Ddt = null;
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
  modalChargeWarehouseRef: BsModalRef;
  modalCopyRef: BsModalRef;

  current_tab = 'header';

  standardPanels: any[] = [
    { id: 1, key: 'header', title: 'APP.TAB.header', content: 'header', active: true, active_new: true, permission: 'PUBLIC' },
    { id: 2, key: 'body', title: 'APP.TAB.body', content: 'body', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 3, key: 'footer', title: 'APP.TAB.footer', content: 'footer', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 4, key: 'other_data', title: 'APP.TAB.other_data', content: 'other_data', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 6, key: 'quotes', title: 'APP.TAB.order_quotes', content: 'quotes', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 7, key: 'orders', title: 'APP.TAB.client_orders', content: 'orders-suppliers', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 8, key: 'orders-suppliers', title: 'APP.TAB.orders_suppliers', content: 'orders-suppliers', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 9, key: 'documents-processed', title: 'APP.TAB.documents_processed', content: 'documents-processed', active: true, active_new: false, permission: 'PUBLIC' },
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
    private ddtService: DdtService,
    private gridUtils: GridUtils,
    public tableMS: TableModalService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    // private formManager: FormManagerService,
  ) {
    this.editorOptions = new JsonEditorOptions();
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.editorOptions.mode = 'view'; // set only one mode
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ddtId) {
      this.ddtId = changes.ddtId.currentValue;
      this.loadDdt();
    }
  }

  ngOnInit() {
    this.initData();

    this.loadContacts();

    if (this.isNew) {
      // empty ddt
      this.initShowedPanels();
      this.ddtService._getDdtDefaultValues(this.user.aziendaId, this.ddtType.id).subscribe(
        (response: any) => {
          const _ddt = this.gridUtils.renameJson(response);
          this.ddt = new Ddt(_ddt);

          this.wDdt = JSON.parse(JSON.stringify(this.ddt));
          this.originalDdt = JSON.parse(JSON.stringify(this.ddt));

          const combos = [
            {
              name: 'SpComboStatoDocumento', aziendaId: this.ddt.aziendaId,
              param: `{"TipoDocumentoId":${this.ddt.tipoDocumentoId},"IsStatoTestata":true}`
            },
            {
              name: 'SpComboSezionale', aziendaId: this.ddt.aziendaId,
              param: `{"TipoDocumentoId":${this.ddt.tipoDocumentoId}}`
            },
          ];
          this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
        },
        (error: any) => {
          this.ddt = new Ddt({ aziendaId: this.user.aziendaId });

          this.wDdt = JSON.parse(JSON.stringify(this.ddt));
          this.originalDdt = JSON.parse(JSON.stringify(this.ddt));
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

    this.tenant = this.authenticationService.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.tenant);

    const tables = [
      'AnagNazione',
      // 'AnagValuta',
      // 'AnagLingua',
      // 'AnagListino',
      'AnagOrigineContatto',
      // 'AnagIVA',
      // 'AnagTipoCliente',
      'AnagValutazione',
      // 'AnagTipoPagamento',
      // 'AnagCategoriaDocumento',
      // 'AnagMagazzino',
      // 'AnagDepartment',
      // 'AnagTipoDocumento',
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);
    this.anagrafiche['statoDocumento'] = APP_CONST.statoDocumento;

    const combos = [
      'SpComboValuta',
      'SpComboLingua',
      'SpComboListino',
      'SpComboIva',
      'SpComboTipoCliente',
      'SpComboTipoDocumento',
      'SpComboCategoriaDocumento',
      { name: 'SpComboMagazzino', aziendaId: this.user.aziendaId },
      'SpComboDepartment',
      'SpComboUtente',
      'SpComboTipoPagamento',
      'SpComboTipoDocumentoDiEvasione',
      {
        name: 'SpComboBancaAzienda',
        param: `{"AziendaId":${this.user.aziendaId}}`
      },
      'SpComboAspettoEsterioreArticolo',
      'SpComboCausaleTrasporto',
      'SpComboTrasportoACuraDel',
      'SpComboPorto',
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
    this.ddt = null;
    this.loadings = [];
  }

  loadDdt() {
    this.error = false;
    if (this.ddtId) {
      this.isNew = false;
      this.loading = true;
      // Get ddt
      this.ddtService.getModel(this.ddtId).subscribe(
        (response: any) => {
          const _ddt = this.gridUtils.renameJson(response);
          this.ddt = _ddt;
          this.wDdt = new Ddt(_ddt); // JSON.parse(JSON.stringify(response));
          this.originalDdt = new Ddt(_ddt); // JSON.parse(JSON.stringify(response));
          this.modifiedModel(this.wDdt, this.originalDdt);
          this.isNew = this.ddt ? false : true;

          this.initShowedPanels();

          const combos = [
            {
              name: 'SpComboStatoDocumento', aziendaId: this.ddt.aziendaId,
              param: `{"TipoDocumentoId":${this.ddt.tipoDocumentoId},"IsStatoTestata":true}`
            },
            {
              name: 'SpComboSezionale', aziendaId: this.ddt.aziendaId,
              param: `{"TipoDocumentoId":${this.ddt.tipoDocumentoId},"IsStatoTestata":true}`
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

  onDdtBodySave(event) {
    this.wDdt = new Ddt(event.testata);
    this.originalDdt = new Ddt(event.testata);
    this.modifiedModel(this.wDdt, this.originalDdt);
  }

  onFormChanges($event) {
    this.modifiedModel(this.wDdt, this.originalDdt);
  }

  get modified() {
    return !_.isEmpty(this.difference);
  }

  prevElement(event) {
    this.next.emit({ data: this.ddt });
  }

  nextElement(event) {
    this.prev.emit({ data: this.ddt });
  }

  closeEdit(event) {
    this.closed.emit({ element: this.ddt });
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
    const body = this.wDdt;

    this.ddtService.saveDdt(this.wDdt.id, body).subscribe(
      (response: any) => {
        const _ddt = this.gridUtils.renameJson(response);
        this.ddt = _ddt;
        this.ddtId = this.ddt.id;
        const ddtData = JSON.parse(JSON.stringify(_ddt));
        this.wDdt = new Ddt(ddtData);
        this.originalDdt = new Ddt(ddtData);
        this.modifiedModel(this.wDdt, this.originalDdt);

        this.notificationService.saved();

        this.save.emit({ data: this.ddt, isNew: this.isNew });
        this.isNew = false;
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      }
    );
  }

  deleteImage(index) {
    // this.removeYesNo().then(
    //   (response: boolean) => {
    //     console.log('ViewEditDdtComponent DeleteImage', index);
    //   }
    // );
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
    // console.log('onChangeModal', type, event);
    switch (type) {
      case 'intestatario':
        this.wDdt.contattoIntestatarioId = event?.contattoId;
        this.wDdt.nominativoIntestatario = event?.ragioneSociale;
        this.wDdt.indirizzoIntestatario = event?.indirizzo;
        this.wDdt.comuneIntestatario = event?.comune;
        this.wDdt.provinciaIntestatario = event?.provincia;
        this.wDdt.capIntestatario = event?.cap;
        this.wDdt.nazioneIntestatario = event?.nazione;
        this.wDdt.nazioneIntestatarioId = event?.anagNazione;
        this.wDdt.codiceFiscale = event?.codiceFiscale;
        this.wDdt.piva = event?.pIva;
        break;
      case 'fatturazione':
        this.wDdt.contattoFatturazioneId = event?.contattoId;
        this.wDdt.nominativoFatturazione = event?.ragioneSociale;
        this.wDdt.indirizzoFatturazione = event?.indirizzo;
        this.wDdt.comuneFatturazione = event?.comune;
        this.wDdt.provinciaFatturazione = event?.provincia;
        this.wDdt.capFatturazione = event?.cap;
        this.wDdt.nazioneFatturazione = event?.nazione;
        this.wDdt.nazioneFatturazioneId = event?.anagNazione;
        break;
      case 'destinazione':
        this.wDdt.contattoDestinazioneId = event?.contattoId;
        this.wDdt.nominativoDestinazione = event?.ragioneSociale;
        this.wDdt.indirizzoDestinazione = event?.indirizzo;
        this.wDdt.comuneDestinazione = event?.comune;
        this.wDdt.provinciaDestinazione = event?.provincia;
        this.wDdt.capDestinazione = event?.cap;
        this.wDdt.nazioneDestinazione = event?.nazione;
        this.wDdt.nazioneDestinazioneId = event?.anagNazione;
        break;
      case 'sezionale':
        this.wDdt.sezionaleId = event?.id;
        this.wDdt.sezionaleDescrizione = event?.value;
        break;
      case 'vettore':
        this.wDdt.vettoreId = event?.contattoId || event?.contattoID;
        this.wDdt.nominativoVettore = event?.ragioneSociale;
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
          return this.ddtService.getContacts(term).pipe(
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
          nomeSp: 'SpComboFornitoreLookUp',
          item: this.wDdt,
          searchTerm: this.wDdt.nominativoIntestatario
        };
        break;
      case 'fatturazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboClienteLookUp',
          item: this.wDdt,
          searchTerm: this.wDdt.nominativoFatturazione
        };
        break;
      case 'destinazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboDestinazioneLookUp',
          item: this.wDdt,
          searchTerm: this.wDdt.nominativoDestinazione
        };
        break;
      case 'sezionale':
        _modalClass = 'modal-lg-full';
        initialState = {
          model: type,
          nomeSp: 'SpComboSezionaleLookUp',
          item: this.wDdt,
          searchTerm: this.wDdt.nominativoDestinazione
        };
        break;
      case 'vettore':
        initialState = {
          model: type,
          nomeSp: 'SpComboVettoreLookUp',
          item: this.wDdt,
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
    if (this.ddtId) {
      const initialState = {
        id: this.ddtId,
        model: 'ddt',
        item: this.ddt
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

  isReadOnly() {
    return this.wDdt?.isReadOnly;
  }

  onDelete(confirm) {
    if (confirm) {
      this.ddtService.deleteModel(this.ddtId).subscribe(
        (response: any) => {
          this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.dtt');
          this.save.emit({ data: this.ddt, isNew: true });
          this.closeEdit(null);
        },
        (error: any) => {
          // console.log('onDelete error', error);
          this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.dtt');
          if (error.error && error.error.Message) {
            this.notificationService.error(error.error.Message, 'APP.TITLE.ddt');
          }
        }
      );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.dtt');
    }
  }
}
