import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { TranslateService } from '@ngx-translate/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { DialogService } from 'ngx-bootstrap-modal';

import { TabsetComponent } from 'ngx-bootstrap/tabs';

import { AuthenticationService } from '@app/services/authentication.service';
import { TablesService } from '@app/views/tables/tables.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { CompaniesService } from '../companies.service';

import { APP_CONST } from '@app/shared/const';

// import { ListRelatedComponent } from '@app/components/list-related/list-related.component';
// import { TimelineRelatedComponent } from '@app/components/timeline-related/timeline-related.component';
// import { ModalChoicesComponent } from '@app/components/modal-choices/modal-choices.component';

import { Company } from '@app/models/company.model';

import * as _ from 'lodash';

@Component({
  selector: 'app-company-edit-view',
  templateUrl: './company-edit-view.component.html',
  styleUrls: ['./company-edit-view.component.scss']
})
export class CompanyEditViewComponent implements OnInit, OnChanges {

  @Input() tenant = null;
  @Input() company = null;
  @Input() readOnly = false;

  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() prev: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();

  // @ViewChild('panelsTabs', { static: false }) panelsTabs: TabsetComponent;

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  model = 'company';

  loadingOptions = APP_CONST.loadingOptions;

  showJsonEditor = false; // APP_CONST.showJsonEditor;

  loading = false;
  // modified = false;
  isNew = true;

  sidebarOpened = false;

  current_tab = 'general_info';

  panels: any[] = [
    { id: 1, key: 'general_info', title: 'APP.TITLE.general_info', content: 'general_info', active: true, active_new: true },
    { id: 2, key: 'warehouses', title: 'APP.TITLE.warehouses', content: 'warehouses', active: true, active_new: false},
    { id: 3, key: 'subsidiaries', title: 'APP.TITLE.subsidiaries', content: 'subsidiaries', active: true, active_new: false}
  ];

  materialTab = false;
  offsetLayout = this.materialTab ? '49px' : '49px';

  originalCompany = null;
  wCompany = null;
  difference = null;

  avatar = null;
  imageLoader = true;
  showAvatars = false;
  showUploads = false;

  loadingWarehouses = false;

  modalRelatedRef: BsModalRef;

  modalEditTitle = '';
  currentType = '';
  currentRelated = null;
  relatedForm: FormGroup;

  loadings = [];
  companyTypeData = [];

  editWarehouse = false;

  anagraficheCombo = [];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private tablesService: TablesService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private companiesService: CompaniesService
  ) {
    this.editorOptions = new JsonEditorOptions();
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.editorOptions.mode = 'view'; // set only one mode


    this.tenant = this.authenticationService.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.tenant);

    const combos = [
      'SpComboNazione',
      'SpComboValuta',
      'SpComboLingua',
      'SpComboIva',
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
  }

  ngOnChanges(changes: any) {
    if (changes.company) {
      this.company = changes.company.currentValue;
      this.isNew = this.company ? false : true;
      if (!this.isNew) {
        this.loadCompany(this.company.id);
      }
    }
  }

  ngOnInit() {
    if (this.isNew) {
      // empty author
      this.company = new Company({});

      this.wCompany = JSON.parse(JSON.stringify(this.company));
      this.originalCompany = JSON.parse(JSON.stringify(this.company));
    }
  }

  onFormChanges($event) {
    this.modifiedModel(this.wCompany, this.originalCompany);
  }

  get modified() {
    return !_.isEmpty(this.difference);
  }

  prevElement(event) {
    this.next.emit({ data: this.company });
  }

  nextElement(event) {
    this.prev.emit({ data: this.company });
  }

  closeEdit(event) {
    this.closed.emit({ element: this.company });
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

  onSelectMatTab(event) {
    this.current_tab = this.panels[event.index].key;
  }

  clickMatTab(panel) {
    this.current_tab = panel.key;
  }

  isTabDisabled(panel) {
    let disabled = panel.active_new ? false : (this.isNew ? true : !panel.active);
    if (!this.isNew && panel.key === 'dati-contabili') {
      // const cindex = this.company.tipoContattoList.findIndex(k => k.name === 'Cliente');
      // disabled = (cindex === -1);
    }
    return disabled;
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
    // console.log('ViewEditCompanyComponent Save', this.wCompany);
    this.save.emit({ data: this.wCompany, difference: this.difference });
    this.eventsManagerService.broadcast(APP_CONST.companyUpdateEvent, this.wCompany);
  }

  deleteImage(index) {
    // this.removeYesNo().then(
    //   (response: boolean) => {
    //     console.log('ViewEditCompanyComponent DeleteImage', index);
    //   }
    // );
  }

  loadCompany(id) {
    this.loading = true;
    this.companiesService.getModel(id).subscribe(
      (response: any) => {
        this.company = response;
        this.wCompany = JSON.parse(JSON.stringify(this.company));
        this.originalCompany = JSON.parse(JSON.stringify(this.company));
        this.modifiedModel(this.wCompany, this.originalCompany);
        this.isNew = false;

        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  toggleEditWarehouse(event) {
    this.editWarehouse = !this.editWarehouse;
  }

  loadWarehouses() {
    this.loadingWarehouses = true;
    this.companiesService.getListWarehouses(this.wCompany.id).subscribe(
      (response: any) => {
        this.wCompany.magazzinoList = response;
        // console.log('loadWarehouses', response);
        this.loadingWarehouses = false;
      },
      (error: any) => {
        this.loadingWarehouses = false;
      }
    );
  }

  modifiedModel(obj1, obj2) {
    this.difference = this.utilsService.objectsDiff(obj1, obj2);
    return !_.isEmpty(this.difference);
  }

  isModifiedProperty(property) {
    // return (this.difference && this.difference.hasOwnProperty(property));
    return (this.difference && _.get(this.difference, property));
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
}
