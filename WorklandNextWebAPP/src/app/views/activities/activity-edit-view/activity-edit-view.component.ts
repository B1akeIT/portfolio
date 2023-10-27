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
import { ActivitiesService } from '../activities.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ModalContactComponent } from '@app/components/modal-contact/modal-contact.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';
import { ModalCopyComponent } from '@app/components/modal-copy/modal-copy.component';

import { Activity } from '@app/models/activity.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-activity-edit-view',
  templateUrl: './activity-edit-view.component.html',
  styleUrls: ['./activity-edit-view.component.scss']
})
export class ActivityEditViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() activityId = null;

  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() prev: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  model = 'activity';

  isNew = this.activityId ? false : true;
  activity = null;

  user = null;

  form: FormGroup;

  loadingOptions = APP_CONST.loadingOptions;

  showJsonEditor = false; // APP_CONST.showJsonEditor;

  loading = false;

  sidebarOpened = false;

  offsetLayout = '49px';

  originalActivity: Activity = null;
  wActivity: Activity = null;
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
    private activitiesService: ActivitiesService,
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
      'SpComboTipoPagamento',
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

  ngOnChanges(changes: any) {
    if (changes.activityId) {
      this.activityId = changes.activityId.currentValue;
      this.loadActivity();
    }
  }

  ngOnInit() {
    this.initData();

    this.loadContacts();

    if (this.isNew) {
      // empty activity
      this.initShowedPanels();
      this.activitiesService._getActivityDefaultValues(this.user.aziendaId).subscribe(
        (response: any) => {
          const _activity = this.gridUtils.renameJson(response);
          this.activity = new Activity(_activity);

          this.wActivity = JSON.parse(JSON.stringify(this.activity));
          this.originalActivity = JSON.parse(JSON.stringify(this.activity));
        },
        (error: any) => {
          this.activity = new Activity({ aziendaId: this.user.aziendaId });

          this.wActivity = JSON.parse(JSON.stringify(this.activity));
          this.originalActivity = JSON.parse(JSON.stringify(this.activity));
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
  }

  clearData() {
    this.activity = null;
    this.loadings = [];
  }

  loadActivity() {
    this.error = false;
    if (this.activityId) {
      this.isNew = false;
      this.loading = true;
      // Get activity
      this.activitiesService.getModel(this.activityId).subscribe(
        (response: any) => {
          const _activity = this.gridUtils.renameJson(response);
          this.activity = _activity;
          this.wActivity = new Activity(_activity);
          this.originalActivity = new Activity(_activity);
          this.modifiedModel(this.wActivity, this.originalActivity);
          this.isNew = this.activity ? false : true;

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

  onActivityBodySave(event) {
    this.onActivityBodyModify(event);
  }

  onActivityBodyDelete(event) {
    this.onActivityBodyModify(event);
  }

  onActivityBodyModify(event) {
    this.wActivity = new Activity(event.testata);
    this.originalActivity = new Activity(event.testata);
    this.modifiedModel(this.wActivity, this.originalActivity);
  }

  onFormChanges($event) {
    this.modifiedModel(this.wActivity, this.originalActivity);
  }

  onChangeField(field, value) {
    console.log('onChangeField', field, value);
  }

  get modified() {
    return !_.isEmpty(this.difference);
  }

  prevElement(event) {
    this.next.emit({ data: this.activity });
  }

  nextElement(event) {
    this.prev.emit({ data: this.activity });
  }

  closeEdit(event?: any) {
    this.closed.emit({ element: this.activity });
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
    const body = this.wActivity;

    this.activitiesService.saveActivity(this.wActivity.id, body).subscribe(
      (response: any) => {
        const _activity = this.gridUtils.renameJson(response);
        this.activity = _activity;
        this.activityId = this.activity.id;
        this.wActivity = new Activity(_activity);
        this.originalActivity = new Activity(_activity);
        this.modifiedModel(this.wActivity, this.originalActivity);

        this.notificationService.saved();

        this.save.emit({ data: this.activity, isNew: this.isNew });
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

  onChangeDepartment(event) {
    const _idx = this.anagraficheCombo['SpComboDepartment'].findIndex((dep: any) => {
      return (Number(dep.id) === Number(this.wActivity.anagDepartmentId));
    });
    // this.wActivity.categoriaDocumentoId = this.anagraficheCombo['SpComboDepartment'][_idx].categoriaDocumentoId;
  }

  onChangeContact(type, event) {
    switch (type) {
      default:
        break;
    }
    this.onFormChanges(event);
  }

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
          return this.activitiesService.getContacts(term).pipe(
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

  onDelete(confirm) {
    if (confirm) {
      this.activitiesService.deleteModel(this.activityId).subscribe(
        (response: any) => {
          this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.activities');
          this.save.emit({ data: this.activity, isNew: true });
          this.closeEdit();
        },
        (error: any) => {
          // console.log('onDelete error', error);
          this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.activities');
          if (error.error && error.error.Message) {
            this.notificationService.error(error.error.Message, 'APP.TITLE.orders');
          }
        }
      );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.activities');
    }
  }
}
