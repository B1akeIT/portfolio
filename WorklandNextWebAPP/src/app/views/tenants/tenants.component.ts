import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { TranslateService } from '@ngx-translate/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { ResizeEvent } from 'angular-resizable-element';

import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { TenantsService } from './tenants.service';
import { Tenant } from '@app/models/tenant.model';

import { APP_CONST } from '@app/shared';

@Component({
  templateUrl: 'tenants.component.html'
})
export class TenantsComponent implements OnInit {

  model = 'tenants';

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  showSidebar = true;
  showInspector = true;
  showSearch = false;
  showBoxFilter = false;
  sideBarStatus = 'inspector';

  panelIsOpen = false;

  hasFilter = false;
  filterData = '';
  hasSorting = false;
  sort = { column: 'id', direction: 'asc' };
  query = '';

  currentIndex = -1;
  currentId = 0;
  currentElement = null;

  columnDefs = [];
  agDefaultColumnDefs = [];
  agAvatarColumn = [];
  agColumnDefs = [];
  agGridOptions = {};

  selectedRows = [];

  gridApi;
  gridColumnApi;

  tenants = [];
  tenantsMeta = null;
  currentTenant = null;

  tenantForm: FormGroup;
  tenant: Tenant;
  tenantModel: Tenant;
  tenantFields: Array<FormlyFieldConfig>;
  optionsForm: FormlyFormOptions;

  options: AnimationOptions = {
    path: '/assets/animations/teamwork-gears.json',
    loop: false,
    autoplay: true
  };

  @ViewChild('sidebarInspector') public sidebarInspectorRef: ElementRef;
  startWidth = 0;
  dragging = false;

  countTranslateParams = { count: '', total: '' };

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private tenantsService: TenantsService
  ) { }

  ngOnInit(): void {
    this.tenantsService.reset();
    this.initGrid(true);
  }

  onResizeStart(event): void {
    this.dragging = true;
    const width = window.getComputedStyle(this.sidebarInspectorRef.nativeElement, null).getPropertyValue('width');
    this.startWidth = parseInt(width, 10);
  }

  onResizing(event): void {
    if (this.sidebarInspectorRef) {
      let newWidth = event.rectangle.width;
      if (newWidth < 250) { newWidth = 250; }
      if (newWidth > 800) { newWidth = 800; }
      this.sidebarInspectorRef.nativeElement.style.width = newWidth + 'px';
    }
  }

  onResizeEnd(event: ResizeEvent): void {
    // if (this.validate(event) && this.sidebarInspectorRef) {
    //   const newWidth = event.rectangle.width;
    //   this.sidebarInspectorRef.nativeElement.style.width = newWidth + 'px';
    // }
    this.dragging = false;
  }

  validate(event: ResizeEvent): boolean {
    return true;
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  toggleInspectorSidebar($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.showInspector = !this.showInspector;
  }

  onFilterChanged(event) {
    console.log('onFilterChanged', event);
  }

  loadTenants() {
    this.loading = true;
    this.error = false;
    // this.tenantsService.getJson(this.model)
    this.tenantsService.getListModel().subscribe(
      (response: any) => {
        this.tenants = (response.items || []);
        this.tenantsMeta = response.meta;
        const count = String(this.tenants.length);
        const total = String(this.tenants.length);
        this.countTranslateParams = { count: count, total: total };
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = error.message;
      }
    );
  }

  refresh() {
    this.clearCurrent();
    // this.resetPagination();
    this.loadTenants();
    this.sideBarStatus = 'inspector';
  }

  dummyAction(event) {
    console.log('dummyAction', event);
  }

  onSave(tenant) {
    // console.log('onSave', tenant);
    let saveObs = null;

    if (tenant.id === 0) {
      saveObs = this.tenantsService.saveModel(tenant);
    } else {
      saveObs = this.tenantsService.updateModel(tenant.id, tenant);
    }

    saveObs.subscribe(
      (response: any) => {
        // console.log('onSave', response);
        this.sideBarStatus = 'inspector';
        this.refresh();

        this.notificationService.success('APP.MESSAGE.saved_message', 'APP.TITLE.tenant');
      },
      (error: any) => {
        console.log('onSave error', error);
        this.notificationService.error('APP.MESSAGE.saved_message_error', 'APP.TITLE.tenant');
      }
    );
  }

  setCurrent(i, element) {
    if (!element || this.currentId === element.id) {
      this.clearCurrent();
      if (this.panelIsOpen) {
        // this.togglePanel();
      }
    } else {
      this.currentIndex = i;
      this.currentId = element.id;
      this.currentElement = element;
      if (this.panelIsOpen) {
        // load tenant currentId
        this.currentTenant = this.currentElement;
      }
    }
  }

  clearCurrent() {
    this.currentIndex = -1;
    this.currentId = 0;
    this.currentElement = null;
    this.currentTenant = null;
  }

  // ag-Grid

  initGrid(refresh) {
    this.initAgGrid();

    if (refresh) {
      this.refresh();
    }
  }

  initAgGrid() {
    const $this = this;

    this.agDefaultColumnDefs = [
      {
        headerName: this.translate.instant('APP.FIELD.id'),
        field: 'id',
        sortable: true, filter: false,
        minWidth: 70, maxWidth: 70
      },
      {
        headerName: this.translate.instant('APP.FIELD.name'),
        field: 'nomeConnessione',
        sortable: true, filter: false,
        minWidth: 120,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' }
      },
      {
        headerName: this.translate.instant('APP.FIELD.dbName'),
        field: 'dbName',
        sortable: true, filter: false,
        minWidth: 120,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' }
      }
    ];

    this.agColumnDefs = this.agDefaultColumnDefs;

    this.agGridOptions = {
      rowSelection: 'single',
      rowMultiSelectWithClick: false,
      localeTextFunc: this.utilsService.localeTextFunc.bind(this),
      getRowNodeId: function (data) {
        return data.id;
      },
      rowClassRules: {
        'item-deactive-': function (params) { return !params.data.isActive; }
      },
      navigateToNextCell: this.utilsService.navigateToNextCell.bind(this),
      animateRows: true
    };
  }

  onGridReady(params) {
    const $this = this;

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
    this.gridApi.resetRowHeights();

    window.addEventListener('resize', function () {
      setTimeout(function () {
        $this.gridApi.sizeColumnsToFit();
        $this.gridApi.resetRowHeights();
      });
    });
  }

  onGridSizeChanged(params) {
    const gridWidth = document.getElementById('grid-wrapper').offsetWidth;
    const columnsToShow = [];
    const columnsToHide = [];
    let totalColsWidth = 0;
    const allColumns = params.columnApi.getAllColumns();
    for (let i = 0; i < allColumns.length; i++) {
      const column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    if (!this.panelIsOpen) {
      params.api.sizeColumnsToFit();
      params.api.resetRowHeights();
    }
  }

  onSelectionChanged(params) {
    const $this = this;
    const selectedRows = this.gridApi.getSelectedRows();
    selectedRows.forEach(function (selectedRow, index) {
      // multiple selction - not managed
      if (index === 0) {
        $this.setCurrent(index, selectedRow);
      }
    });
    if (selectedRows.length === 0) {
      this.setCurrent(0, null);
      this.selectedRows = [];
    } else {
      this.selectedRows = selectedRows;
    }
    this.sideBarStatus = 'inspector';
  }

  onDoubleClicked(params) {
    // this.togglePanel();
    this.onEdit();
  }

  setNewData(id, data) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(id);
      if (rowNode) { rowNode.setData(data); }
    }
  }

  onEdit(id?) {
    this.tenantForm = new FormGroup({});
    if (this.currentId && (id !== 0)) {
      this.tenantModel = new Tenant(this.currentElement);
    } else {
      this.tenantModel = new Tenant({});
    }
    const modifiedFields = [];
    const additionalFields = [];
    const replacedItems = this.tenantModel.formField().map(x => {
      const item = modifiedFields.find(({ key }) => key === x.key);
      return item ? item : x;
    });
    this.tenantFields = [...replacedItems, ...additionalFields];

    this.optionsForm = {
      formState: {
        readOnly: true
      },
    };

    this.sideBarStatus = 'edit';
  }

  onDelete(confirm) {
    if (confirm) {
      this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.tenants');
      // this.tenantsService.deleteModel(this.currentId).subscribe(
      //   (response: any) => {
      //     console.log('onDelete', response);
      //     this.refresh();
      //   },
      //   (error: any) => {
      //     console.log('onDelete error', error);
      //     this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.tenants');
      //   }
      // );
    } else {
      // this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.tenants');
    }
  }

  // Panel

  togglePanel() {
    this.panelIsOpen = !this.panelIsOpen;
    this.currentTenant = this.panelIsOpen ? this.currentElement : null;
  }

  closePanel() {
    this.panelIsOpen = false;

    // this.eventsManagerService.broadcast(APP_CONST.closeFloatPanelEvent, true);
  }

  onClosePanel(event) {
    this.closePanel();
    // refresh selected element
    // this.saveStatus = null;
  }
}
