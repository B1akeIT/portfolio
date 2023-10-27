import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DialogService } from 'ngx-bootstrap-modal';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { ResizeEvent } from 'angular-resizable-element';

import { AuthenticationService } from '@app/services/authentication.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { CompaniesService } from './companies.service';
import { ResizableService } from '@app/services/resizable.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';
import { Contact } from '@app/models/contact.model';

import * as _ from 'lodash';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

@Component({
  templateUrl: 'companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  model = 'azienda';

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  showBarNew = true;
  showBarEdit = true;
  showBarDelete = true;
  showBarPrint = true;
  showBarSearch = true;
  showBarRefreah = true;

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

  tenants = [];
  tenant = null;

  agDefaultColumnDefs = null;
  agColumnDefs = [];
  agGridOptions = {};

  schema = [];

  selectedRows = [];
  multiSelection: boolean = false;

  gridApi;
  gridColumnApi;

  gridPinned = false;

  companies = [];
  companiesMeta = null;
  currentCompany = null;
  companiesFiltered = [];

  options: AnimationOptions = {
    path: '/assets/animations/teamwork-gears.json',
    loop: false,
    autoplay: true
  };

  @ViewChild('sidebarInspector') public sidebarInspectorRef: ElementRef;
  startWidth = 0;
  dragging = false;

  roles = [];

  fxlayoutConfig = {
    header: true,
    leftSidebar: false,
    rightSidebar: true,
    footer: true
  };

  notificationDefaultOptions = {
    position: ['top', 'right'],
    timeOut: 1500,
    lastOnBottom: true,
    showProgressBar: false,
    pauseOnHover: false,
    clickToClose: true
  };

  modalPrintRef: BsModalRef;

  limit = 0;
  perPage = 200;
  currentPage = 1;

  maxPages = 5;
  numPages = 0;
  countTranslateParams = { count: '', total: '' };

  selectPerPage = APP_CONST.defaultPagination.perPageArr;

  lottieArrowOptions: AnimationOptions = {
    path: '/assets/animations/arrow-up-icon.json'
  };

  filterType = {
    headquarter: false,
    subsidiary: false
  };

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private companiesService: CompaniesService,
    public resizable: ResizableService,
    public gridUtils: GridUtils
  ) {
    this.tenants = this.authenticationService.getTenants();

    this.eventsManagerService.on(APP_CONST.companyUpdateEvent, (event) => {
      const company = event;
      // const index = _.findIndex(this.companies, { id: company.id });
      this.setNewData(company.id, company);
    });
  }

  ngOnInit(): void {
    // Init Resizable Service
    // this.resizable.setElementRef(this.sidebarInspectorRef);
  }

  fxLayoutBodyHeight() {
    const hf = (this.fxlayoutConfig.header ? 40 : 0) + (this.fxlayoutConfig.footer ? 40 : 0);
    return `calc( 100% - ${hf}px )`;
  }

  onTenant(event) {
    this.tenant = event;
    this.companiesService.reset();
    this.companiesService.setTenent(this.tenant);
    this.companies = [];
    this.companiesFiltered = [];
    this.companiesMeta = null;
    if (this.tenant) {
      this.initGrid(true);
    } else {
      this.resetPagination();
    }
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
    // if (this.validate() && this.sidebarInspectorRef) {
    //   const width = window.getComputedStyle(this.sidebarInspectorRef.nativeElement, null).getPropertyValue('width');
    //   const left: any = event.edges.left;
    //   const newWidth = (this.startWidth - left);
    //   this.sidebarInspectorRef.nativeElement.style.width = newWidth + 'px';
    // }
    this.dragging = false;
  }

  validate(event: ResizeEvent): boolean {
    return true;
  }

  onResizeStop(event): void {
    console.log('Element was resized', event);
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
    // console.log('onFilterChanged', event);
    this.companiesService.setQuery(event);
    this.loadCompanies();
  }

  loadCompanies() {
    this.loading = true;
    this.companiesService.getListModel().subscribe(
      (response: any) => {
        this.companies = (response.items || []).map(item => this.gridUtils.renameJson(item));
        this.companiesFiltered = (response.items || []).map(item => this.gridUtils.renameJson(item));
        this.companiesMeta = response.meta;
        if (this.companiesMeta && this.companiesMeta.pagination) {
          this.numPages = this.companiesMeta.pagination.total_pages;
          const fromCount = (this.currentPage - 1) * this.perPage + 1;
          const toCount = this.isLastPage() ? this.companiesMeta.pagination.total : this.currentPage * this.perPage;
          const count = fromCount + ' - ' + toCount;
          this.countTranslateParams = {
            count: count,
            total: this.companiesMeta.pagination.total
          };
        } else {
          this.numPages = 0;
          const count = String(this.companies.length);
          const total = String(this.companies.length);
          this.countTranslateParams = { count: count, total: total };
        }
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
    this.resetPagination();
    this.loadCompanies();
  }

  setFilterType(event) {
    const $this = this;

    if (this.filterType.headquarter && this.filterType.subsidiary) {
      setTimeout(() => {
        this.filterType = {
          headquarter: false,
          subsidiary: false
        };
        this.companiesFiltered = this.companies;
      }, 200);
    } else if (this.filterType.headquarter || this.filterType.subsidiary) {
      setTimeout(() => {
        this.companiesFiltered = this.companiesFiltered.filter(function (o) {
          if ($this.filterType.headquarter) { return (o.aziendaId === null); }
          if ($this.filterType.subsidiary) { return (o.aziendaId !== null); }
        });
      }, 200);
    } else {
      this.companiesFiltered = this.companies;
    }
    this.clearCurrent();
  }

  dummyAction(event) {
    console.log('dummyAction', event);
  }

  onDelete(confirm) {
    if (confirm) {
      this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.companies');
      // this.companiesService.deleteModel(this.currentId).subscribe(
      //   (response: any) => {
      //     console.log('onDelete', response);
      //     this.refresh();
      //   },
      //   (error: any) => {
      //     console.log('onDelete error', error);
      //     this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.companies');
      //   }
      // );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.companies');
    }
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
    }
  }

  clearCurrent() {
    this.error = false;
    this.errorMessage = '';
    this.currentIndex = -1;
    this.currentId = 0;
    this.currentElement = null;
    this.currentCompany = null;
  }

  resetPagination() {
    this.limit = APP_CONST.defaultPagination.limit;
    // this.perPage = APP_CONST.defaultPagination.perPage;
    this.maxPages = APP_CONST.defaultPagination.maxPages;
    this.currentPage = 1;
    this.companiesService.setLimit(this.limit);
    this.companiesService.setPerPage(this.perPage);
    this.companiesService.setPage(this.currentPage);
    this.companiesService.setFilterSearch(this.filterData);
    this.companiesService.setFilterQuery(this.query);
    this.companiesService.setSort(this.sort.column, this.sort.direction);
    this.clearCurrent();
  }

  isLastPage() {
    if (this.companiesMeta && this.companiesMeta.pagination) {
      return (this.currentPage === this.companiesMeta.pagination.total_pages);
    }
    return false;
  }

  perPageChanged() {
    this.companiesService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadCompanies();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.companiesService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadCompanies();
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

    this.agDefaultColumnDefs = {
      autoHeight: false,
      sortable: true,
      filter: false,
      cellStyle: { 'white-space': 'normal' }
    };

    this.schema = [
      { ColumnName: 'id'},
      { ColumnName: 'aziendaId'},
      { ColumnName: 'ragioneSociale'},
      { ColumnName: 'isDefaultValue'},
      { ColumnName: 'anagIvaDescrizione'}
    ];

    let cDef = null;
    this.schema.forEach(obj => {
      cDef = this.gridUtils.getColumnDefBySchema(obj);
      cDef.headerName = obj.ColumnDesc || cDef.headerName;
      cDef.minWidth = obj.Width || cDef.minWidth;
      cDef.maxWidth = obj.Width || cDef.maxWidth;
      if (cDef) {
        if ((obj.ColumnName === 'id') || (obj.ColumnName === 'Id')) {
          cDef.headerCheckboxSelection = this.multiSelection;
          cDef.checkboxSelection = this.multiSelection;
          cDef.minWidth = 90;
          cDef.maxWidth = 90;
        }
        if ((obj.ColumnName === 'aziendaId') || (obj.ColumnName === 'AziendaId')) {
          cDef = {
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'aziendaId',
            sortable: false,
            minWidth: 40, maxWidth: 40,
            cellRenderer: function (params) {
              const classDiv = 'text-center';
              const style = '';
              const data = params.value;
              const icon = data ? '<i class="cui-minus"></i>' : '<ion-icon name="business-outline"></ion-icon>';
              let result = '<div class="' + classDiv + '" style="' + style + '">';
              result += '<span class="">' + icon + '</span>';
              result += '</div>';
              return result;
            }
          }
        }

        this.agColumnDefs.push(cDef);
      } else {
        console.log('Column not defined', obj);
      }
    });

    this.agGridOptions = {
      rowSelection: 'single',
      rowMultiSelectWithClick: false,
      localeTextFunc: this.utilsService.localeTextFunc.bind(this),
      getRowNodeId: function (data) {
        return data.id;
      },
      // rowClassRules: {
      //   'item-deactive': function (params) { return !params.data.isActive; }
      // },
      navigateToNextCell: this.utilsService.navigateToNextCell.bind(this),
      animateRows: true
    };
  }

  onGridReady(params) {
    const $this = this;

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.gridApi.sizeColumnsToFit();
    this.gridApi.resetRowHeights();

    window.addEventListener('resize', function () {
      setTimeout(function () {
        // $this.gridApi.sizeColumnsToFit();
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
      // params.api.sizeColumnsToFit();
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
    // this.sideBarStatus = 'inspector';
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

  getRoleId() {
    const roleName = this.currentElement.roles.length > 0 ? this.currentElement.roles[0] : '';
    const index = _.findIndex(this.roles, { name: roleName });
    return ( index !== -1 ) ? this.roles[index].id : 0;
  }

  onEdit(isNew = false) {
    if (isNew) {
      this.clearCurrent();
    }

    this.togglePanel();
  }

  setPinned() {
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'id',
          pinned: 'left',
        },
        {
          colId: 'aziendaId',
          pinned: 'left',
        },
        {
          colId: 'contatto.ragioneSociale',
          pinned: 'left',
        }
      ],
      defaultState: { pinned: null },
    });
  }

  clearPinned() {
    this.gridColumnApi.applyColumnState({ defaultState: { pinned: null } });
  }

  togglePinned() {
    this.gridPinned = !this.gridPinned;
    (this.gridPinned) ? this.setPinned() : this.clearPinned();
  }

  // Panel

  togglePanel() {
    this.panelIsOpen = !this.panelIsOpen;
    this.currentCompany = this.panelIsOpen ? this.currentElement : null;
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

  clearFilterSort() {
    const oneEmit = this.hasFilter || this.hasSorting;
    if (oneEmit) {
      this.filterData = '';
      this.hasFilter = false;
      this.hasSorting = false;
      this.sort = { column: 'id', direction: 'asc' };
      // this.companiesSortingComponent.clearSorting(false);
      // this.companiesFilterComponent.clearFilter(true);
    }
  }

  onGroupSorting($event) {
    this.sort.column = $event.field;
    this.sort.direction = $event.direction;
    this.companiesService.setSort($event.field, $event.direction);
    this.hasSorting = ($event.field && $event.field !== '');
    this.refresh();
  }

  onGroupFilters($event) {
    let filter = '';
    // Object.keys($event).forEach(
    //   key => {
    //     filter += filter ? ';' : '';
    //     switch (key) {
    //       case 'is_company':
    //         filter += key + ':' + ($event[key] ? '1' : '0');
    //         break;
    //       case 'qualification':
    //         filter += 'q_meta->' + key + ':' + $event[key];
    //         break;
    //       default:
    //         filter += key + ':' + $event[key];
    //     }
    //   }
    // );
    // this.companiesService.setFilterSearch(filter);
    this.hasFilter = (filter !== '');
    this.filterData = filter;
    this.refresh();
  }

  // save edit

  onSave(event) {
    console.log('onSave', event);
    this.companiesService.saveCompany(this.tenant, event.data).subscribe(
      (response: any) => {
        this.notificationService.success('APP.MESSAGE.saved', 'APP.MESSAGE.saved_message');
        if (!event.data.id) { this.loadCompanies(); }
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(title, message);
      }
    );
  }

  // Print

  openPrintModal($event) {
    $event.preventDefault();
    $event.stopPropagation();

    // const initialState = {
    //   model: 'contact'
    // };
    // this.modalPrintRef = this.modalService.show(PrintComponent, {
    //   ignoreBackdropClick: true,
    //   class: 'modal-lg',
    //   initialState: initialState
    // });
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

  onNextElement($event) {
    console.log('onNextElement', $event);
  }

  onPrevElement($event) {
    console.log('onPrevElement', $event);
  }
}
