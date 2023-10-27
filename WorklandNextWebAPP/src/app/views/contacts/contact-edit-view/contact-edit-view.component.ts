import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { DialogService } from 'ngx-bootstrap-modal';

// import { TabsetComponent } from 'ngx-bootstrap/tabs';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { ContactsService } from '../contacts.service';
import { TableModalService } from '@app/services/tables-modal.service';
import { TablesService } from '@app/views/tables/tables.service';
// import { FormManagerService } from '@app/services/form/form-manager.service';
import { NotificationService } from '@app/core/notifications/notification.service';

import { Contact } from '@app/models/contact.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-contact-edit-view',
  templateUrl: './contact-edit-view.component.html',
  styleUrls: ['./contact-edit-view.component.scss']
})
export class ContactEditViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() contact = null;
  @Input() contactId = null;
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() readOnly = false;

  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() prev: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();

  // @ViewChild('panelsTabs', { static: false }) panelsTabs: TabsetComponent;

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  model = 'contact';

  form: FormGroup;

  loadingOptions = APP_CONST.loadingOptions;

  showJsonEditor = false; // APP_CONST.showJsonEditor;

  loading = false;

  isNew = true;

  sidebarOpened = false;

  bodyOffset = 0;

  current_tab = 'general_info';

  standardPanels: any[] = [
    { id: 1, key: 'general_info', title: 'APP.TITLE.general_info', content: 'general_info', active: true, active_new: true, permission: 'PUBLIC' },
    // tslint:disable-next-line: max-line-length
    { id: 2, key: 'contacts', title: 'APP.TITLE.contacts', content: 'contacts', active: true, active_new: false, permission: 'TABCONTATTI' },
    { id: 3, key: 'client-data', title: 'APP.TITLE.client-data', content: 'client-data', active: true, active_new: false, permission: 'TABCLIENTE' },
    { id: 4, key: 'supplier-data', title: 'APP.TITLE.supplier-data', content: 'supplier-data', active: true, active_new: false, permission: 'TABFORNITORE' },
    // tslint:disable-next-line: max-line-length
    { id: 12, key: 'carrier-data', title: 'APP.TITLE.carrier-data', content: 'carrier-data', active: true, active_new: false, permission: 'TABVETTORE' },
    { id: 5, key: 'unit', title: 'APP.TITLE.unit', content: 'unit', active: true, active_new: false, shown_unita: false, permission: 'TABUNITA' },
    // tslint:disable-next-line: max-line-length
    { id: 6, key: 'connected-units', title: 'APP.TITLE.connected-units', content: 'connected-units', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 7, key: 'quotes', title: 'APP.TITLE.quotes', content: 'quotes', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 8, key: 'orders', title: 'APP.TITLE.client_orders', content: 'orders', active: true, active_new: false, permission: 'PUBLIC' },
    // tslint:disable-next-line: max-line-length
    { id: 9, key: 'orders-suppliers', title: 'APP.TITLE.client_orders_suppliers', content: 'orders-suppliers', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 10, key: 'ddt', title: 'APP.TITLE.client_ddt', content: 'ddt', active: true, active_new: false, permission: 'PUBLIC' },
    // tslint:disable-next-line: max-line-length
    { id: 11, key: 'invoices', title: 'APP.TITLE.client_invoices', content: 'invoices', active: true, active_new: false, permission: 'PUBLIC' },
    // tslint:disable-next-line: max-line-length
    { id: 12, key: 'activities', title: 'APP.TITLE.activities', content: 'activities', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 13, key: 'visits', title: 'APP.TITLE.visits', content: 'visits', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 14, key: 'general-news', title: 'APP.TITLE.general-news', content: 'general-news', active: true, active_new: false, permission: 'PUBLIC' },
  ];

  unitPanels: any[] = [
    { id: 1, key: 'general_info', title: 'APP.TITLE.general_info', content: 'general_info', active: true, active_new: true, permission: 'PUBLIC' },
    // tslint:disable-next-line: max-line-length
    { id: 2, key: 'contacts', title: 'APP.TITLE.contacts', content: 'contacts', active: true, active_new: false, permission: 'TABCONTATTI' },
    // tslint:disable-next-line: max-line-length
    { id: 6, key: 'connected-units', title: 'APP.TITLE.connected-units', content: 'connected-units', active: true, active_new: false, permission: 'TABUNITA' },
    { id: 7, key: 'quotes', title: 'APP.TITLE.quotes', content: 'quotes', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 8, key: 'orders', title: 'APP.TITLE.orders', content: 'orders', active: true, active_new: false, permission: 'PUBLIC' },
    // tslint:disable-next-line: max-line-length
    { id: 9, key: 'activities', title: 'APP.TITLE.activities', content: 'activities', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 10, key: 'visits', title: 'APP.TITLE.visits', content: 'visits', active: true, active_new: false, permission: 'PUBLIC' },
    { id: 11, key: 'general-news', title: 'APP.TITLE.general-news', content: 'general-news', active: true, active_new: false, permission: 'PUBLIC' },
  ];

  panels: any[] = this.standardPanels;
  showedPanels: any[] = [];

  contactsPanels: any[] = [
    { id: 1, key: 'emails', title: 'APP.TITLE.emails', content: 'emails', active: true, active_new: true, permission: 'TABEMAILCONTATTO' },
    // tslint:disable-next-line: max-line-length
    { id: 2, key: 'references', title: 'APP.TITLE.references', content: 'references', active: true, active_new: false, permission: 'TABRIFERIMENTOCONTATTO' },
    { id: 3, key: 'local-units', title: 'APP.TITLE.local-units', content: 'local-units', active: true, active_new: false, permission: 'TABCONTATTOUNITALOCALE' }
  ];

  materialTab = true;
  offsetLayout = this.materialTab ? '49px' : '49px';

  originalContact: Contact = null;
  wContact: Contact = null;
  difference = null;

  tenant = null;
  user = null;

  avatar = null;
  imageLoader = true;
  showAvatars = false;
  showUploads = false;

  modalEditTitle = '';
  currentType = '';

  loadings = [];
  contactTypeData = [];
  tipoContattoList = [];

  aziende: any[] = [];
  currentAziendaId = 0;
  currentAzienda = null;

  currentPanelContactIndex: number = 0;
  currentPanelContact = this.contactsPanels[0];

  nations = [];
  currencies = [];
  languages = [];
  origineContatti = [];
  ports = [];
  clientTypes = [];
  valutations = [];

  anagrafiche = [];
  anagraficheCombo = [];

  nationLoading = false;
  nationId = null;

  modalTableRef: BsModalRef;
  currentTable = null;
  tables = null;
  tableSaveSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private dialogService: DialogService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private contactsService: ContactsService,
    public tableMS: TableModalService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    // private formManager: FormManagerService,
  ) {
    this.editorOptions = new JsonEditorOptions();
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.editorOptions.mode = 'view'; // set only one mode

    this.tenant = this.authenticationService.getCurrentTenant();
    this.user = this.authenticationService.getUserTenant();
    this.currentAziendaId = this.user.aziendaId;

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.tenant);

    const tables = [
      // 'AnagNazione',
      // 'AnagValuta',
      // 'AnagLingua',
      'AnagOrigineContatto',
      // 'AnagValutazione',
      // 'AnagTipoCliente',
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    const combos = [
      'SpComboNazione',
      'SpComboValuta',
      'SpComboLingua',
      // 'SpComboOrigineContatto', // ?
      // 'SpComboTipoCliente',
      'SpComboValutazione',
      'SpComboAzienda',
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

    this.tableSaveSubscription = this.tableMS.onSave.subscribe(
      (result: any) => {
        const updateTables = [result.table.api];
        this.utilsService.getAnagrafiche(updateTables, this.anagrafiche);
      }
    );
  }

  ngOnChanges(changes: any) {
    if (changes.contact) {
      this.loading = true;
      this.contact = changes.contact.currentValue;
      this.wContact = JSON.parse(JSON.stringify(changes.contact.currentValue));
      this.originalContact = JSON.parse(JSON.stringify(changes.contact.currentValue));
      this.modifiedModel(this.wContact, this.originalContact);
      this.isNew = this.contact ? false : true;

      if (!this.isNew) {
        if (!this.isUnita()) {
          this.tipoContattoList = this.contact.specializzazioneContattoType.split(';');
          this.tipoContattoList.forEach(item => {
            this.loadings[item] = true;
            this.contactTypeData[item] = null;
            this.loadContactType(item);
          });
        }
      }

      this.loading = false;
    }
    if (changes.contactId) {
      this.contactId = changes.contactId.currentValue;
      this.loadContact();
    }
  }

  ngOnInit() {
    if (this.isNew) {
      // empty contact
      this.contact = new Contact({});

      this.wContact = JSON.parse(JSON.stringify(this.contact));
      this.originalContact = JSON.parse(JSON.stringify(this.contact));
    } else {
      this.nationId = this.wContact.anagNazioneId;
    }

    this.bodyOffset = (this.showHeader ? 40 : 0) + (this.showFooter ? 40 : 0);
  }

  ngOnDestroy() {
    this.tableSaveSubscription.unsubscribe();
  }

  reloadData() {
    this.loadContact();
  }

  clearData() {
    this.contact = null;
    this.loadings = [];
    this.contactTypeData = [];
  }

  loadContact() {
    if (this.contactId) {
      this.loading = true;
      // Get contact
      this.contactsService.getModel(this.contactId).subscribe(
        (response: any) => {
          this.contact = response;
          this.wContact = JSON.parse(JSON.stringify(response));
          this.originalContact = JSON.parse(JSON.stringify(response));
          this.modifiedModel(this.wContact, this.originalContact);
          this.isNew = this.contact ? false : true;

          if (!this.isNew) {
            if (!this.isUnita()) {
              this.tipoContattoList = this.contact.specializzazioneContattoType ? this.contact.specializzazioneContattoType.split(';') : [];
              this.tipoContattoList.forEach(item => {
                this.loadings[item] = true;
                this.contactTypeData[item] = null;
                this.loadContactType(item);
              });
            }
          }

          if (this.isUnita()) {
            this.panels = this.unitPanels;
          }

          this.initShowedPanels();

          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        }
      );
    } else {
      this.clearData();
    }
  }

  initShowedPanels() {
    this.panels.forEach(item => {
      if (this.authenticationService.hasPermission(item.permission)) {
        this.showedPanels.push(item);
      }
    });
    this.onSelectTab(this.panels[0]);
  }

  loadContactType(type) {
    this.loadings[type] = true;
    this.contactsService.getContactType(this.contact.id, type).subscribe(
      (resp: any) => {
        this.contactTypeData[type] = resp;
        this.loadings[type] = false;
      }
    );
  }

  getClient() {
    let client = null;
    if (this.isCliente()) {
      client = this.contactTypeData['Cliente'];
    }
    return client;
  }

  onFormChanges($event) {
    this.modifiedModel(this.wContact, this.originalContact);
  }

  get modified() {
    return !_.isEmpty(this.difference);
  }

  prevElement(event) {
    this.next.emit({ data: this.contact });
  }

  nextElement(event) {
    this.prev.emit({ data: this.contact });
  }

  closeEdit(event) {
    this.closed.emit({ element: this.contact });
  }

  toggleSidebar($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.sidebarOpened = !this.sidebarOpened;
    this.eventsManagerService.broadcast(APP_CONST.toggleSidebarEvent, this.sidebarOpened);
  }

  onSelectTab(data): void {
    this.current_tab = data.key;
    this.eventsManagerService.broadcast(APP_CONST.toggleSidebarEvent, this.sidebarOpened);
  }

  onSelectMatTabChange(event) {
    // this.current_tab = this.panels[event.index].key;
    this.current_tab = this.showedPanels[event.index].key;
  }

  clickMatTab(panel) {
    this.current_tab = panel.key;
  }

  isTabDisabled(panel) {
    const disabled = panel.active_new ? false : (this.isNew ? true : !panel.active);
    return disabled;
  }

  isCliente() {
    return this.utilsService.hasValueString(this.contact.specializzazioneContattoType, 'Cliente');
  }

  isSupplier() {
    return this.utilsService.hasValueString(this.contact.specializzazioneContattoType, 'Fornitore');
  }

  isUnita() {
    return this.utilsService.hasValueString(this.contact.specializzazioneContattoType, 'Unita');
  }

  getNomeProprietario() {
    let nome = '';
    const unita = (this.wContact['datiUnita'] ? this.wContact['datiUnita'] : null);
    if (unita) {
      nome = unita.proprietario;
    }
    return nome;
  }

  isTabActive(tab) {
    return (tab === this.current_tab);
  }

  showTab(id): void {
    // const cindex = this.panels.findIndex(k => k.id === this.current_tab);
    // const index = this.panels.findIndex(k => k.id === id);

    // this.panelsTabs.tabs[cindex].active = false;
    // this.current_tab = id;
    // if (index >= 0) {
    //   this.panelsTabs.tabs[index].active = true;
    // }
  }

  saveEdit(event) {
    // const body = (event.data.id) ? event.difference : event.data;
    const body = this.wContact;

    this.contactsService.saveContact(this.wContact.id, body).subscribe(
      (response: any) => {
        this.contact = response;
        this.contactId = response.id;

        this.notificationService.saved();
        this.save.emit({ data: this.contact, isNew: this.isNew });

        this.loadContact();
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
    //     console.log('ViewEditContactComponent DeleteImage', index);
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

  setCurrentAzienda(event, item) {
    if (event.altKey) {
      this.currentAziendaId = this.user.aziendaId;
    } else {
      this.currentAziendaId = item.id;
    }
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

  onAddAccounting() {
    // dummy
  }

  onDeleteAccounting(confirm) {
    // confirm
  }

  setCurrentPanelContact(event, panel) {
    this.currentPanelContact = panel;
  }

  setCurrentPanelContactTab(event) {
    this.currentPanelContact = this.contactsPanels[event.index];
  }

  customSearchFn(term, item) {
    term = term.toLowerCase();
    return item.descrizione.toLowerCase().indexOf(term) > -1;
  }

  onChangeNazione(event) {
    this.onFormChanges(event);
  }

  onDeleteUnita(event) {
    // console.log('onDeleteUnit', event);
    this.contactsService.deleteUnita(event).subscribe(
      (response: any) => {
        this.loadContact();
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      }
    );
  }
}
