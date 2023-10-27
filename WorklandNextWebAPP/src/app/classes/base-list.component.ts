import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { formatCurrency } from '@angular/common';

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
import { BaseListService } from './base.service';
import { ResizableService } from '@app/services/resizable.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ModalCopyComponent } from '@app/components/modal-copy/modal-copy.component';

import { APP_CONST } from '@app/shared';
import { Order } from '@app/models/order.model';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  templateUrl: 'base-list.component.html',
  styleUrls: ['./base-list.component.scss']
})
export class BaseListComponent implements OnInit {

  model = 'base';

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  user = null;

  showBarNew = true;
  showBarEdit = true;
  showBarDelete = true;
  showBarPrint = true;
  showBarFilter = true;
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
  hasSorting = true;
  sort = { column: 'dataCreazione', direction: 'desc' };
  query = '';

  sortingFields = [];

  filterRangeDate = { dataInizio: '01-01-2011', dataFine: null };

  dateOptions = {
    format: 'dd-MM-yyyy'
  };

  currentIndex = -1;
  currentId = 0;
  currentElement = null;

  agDefaultColumnDefs = null;
  agColumnDefs = [];
  agGridOptions = {};

  selectedRows = [];

  gridApi;
  gridColumnApi;

  gridPinned = false;

  orders = [];
  schema = [];
  ordersMeta = null;
  currentOrder = null;

  orderForm: FormGroup;
  order: Order;
  orderFields: Array<FormlyFieldConfig>;
  optionsForm: FormlyFormOptions;

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

  modalPrintRef: BsModalRef;
  modalCopyRef: BsModalRef;
  modalChargeWarehouseRef: BsModalRef;

  limit = 0;
  perPage = 50;
  currentPage = 1;

  maxPages = 5;
  numPages = 0;
  countTranslateParams = { count: '', total: '' };

  selectPerPage = APP_CONST.defaultPagination.perPageArr;

  rowModelType = 'serverSide';
  serverSideStoreType = 'partial';

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private baseListService: BaseListService,
    public resizable: ResizableService,
    public gridUtils: GridUtils
  ) {
    this.eventsManagerService.on(APP_CONST.orderUpdateEvent, (event) => {
      const order = event;
      const index = _.findIndex(this.orders, { id: order.id });
      this.setNewData(order.id, order);
    });
  }

  ngOnInit(): void {
    const tenant = this.authenticationService.getCurrentTenant();

    this.baseListService.reset();
    this.baseListService.setTenent(tenant);
    this.initData();

    // Init Resizable Service
    // this.resizable.setElementRef(this.sidebarInspectorRef);
  }

  fxLayoutBodyHeight() {
    const hf = (this.fxlayoutConfig.header ? 40 : 0) + (this.fxlayoutConfig.footer ? 40 : 0);
    return `calc( 100% - ${hf}px )`;
  }

  initData() {
    this.loading = true;

    this.user = this.authenticationService.getUserTenant();

    this.baseListService.getGrid('RicercaOrdineClienteTestataView').subscribe(
      (response: any) => {
        if (response && response.schemaDescription) {
          const jsonSchema = JSON.parse(response.schemaDescription)[0];
          const columnSchemas = JSON.parse(jsonSchema.ColumnSchemas);
          const visibilityStatus = JSON.parse(jsonSchema.VisibilityStatus);
          const gridStatus = JSON.parse(jsonSchema.GridStatus);
          const filterStatus = JSON.parse(jsonSchema.FilterStatus);
          const orderColumns = gridStatus.columns;

          this.schema = columnSchemas.filter(elem => {
            const visibilityItem = _.findIndex(visibilityStatus, { 'columnName': elem.ColumnName, 'isVisible': true });
            return (visibilityItem !== -1);
          });

          this.schema.sort((a: any, b: any) => {
            const aObj = _.find(orderColumns, { 'columnName': a.ColumnName });
            const bObj = _.find(orderColumns, { 'columnName': b.ColumnName });
            return aObj.position - bObj.position;
          });
        } else {
          // Default schema
          this.schema = [];
        }

        this.initGrid(true);
      },
      (error: any) => {
        console.log('getGrid error', error);
        this.loading = false;
        this.error = true;
        this.errorMessage = error.message;
      }
    );
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
    this.baseListService.setQuery(event);
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    // this.baseListService.getJson(this.model)
    this.baseListService.getListModel().subscribe(
      (response: any) => {
        this.orders = (response.items || []);
        this.ordersMeta = response.meta;
        if (this.ordersMeta && this.ordersMeta.totalItems) {
          this.numPages = Math.ceil(this.ordersMeta.totalItems / this.perPage);
          const fromCount = (this.currentPage - 1) * this.perPage + 1;
          const toCount = this.isLastPage() ? this.ordersMeta.totalItems : this.currentPage * this.perPage;
          const count = fromCount + ' - ' + toCount;
          this.countTranslateParams = {
            count: count,
            total: this.ordersMeta.totalItems
          };
        } else {
          this.numPages = 0;
          const count = String(this.orders.length);
          const total = String(this.orders.length);
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
    this.loadOrders();
  }

  onCopy() {
    if (this.currentId) {
      const initialState = {
        id: this.currentId,
        model: 'order-supplier',
        item: this.currentElement
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
          this.refresh();
        }
      );
    } else {
      console.log('onCopy', 'Select element');
    }
  }

  dummyAction(event) {
    console.log('dummyAction', event);
  }

  onSave(event) {
    if (event.isNew) { this.loadOrders(); }
  }

  onDelete(confirm) {
    if (confirm) {
      this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.orders');
      // this.baseListService.deleteModel(this.currentId).subscribe(
      //   (response: any) => {
      //     console.log('onDelete', response);
      //     this.refresh();
      //   },
      //   (error: any) => {
      //     console.log('onDelete error', error);
      //     this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.orders');
      //   }
      // );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.orders');
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
    this.currentOrder = null;
  }

  isOwner() {
    return (this.user?.aziendaId === this.currentElement?.aziendaInserimentoId);
  }

  resetPagination() {
    this.limit = APP_CONST.defaultPagination.limit;
    // this.perPage = APP_CONST.defaultPagination.perPage;
    this.maxPages = APP_CONST.defaultPagination.maxPages;
    this.currentPage = 1;
    this.baseListService.setLimit(this.limit);
    this.baseListService.setPerPage(this.perPage);
    this.baseListService.setPage(this.currentPage);
    this.baseListService.setFilterSearch(this.filterData);
    this.baseListService.setFilterQuery(this.query);
    this.baseListService.setSort(this.sort.column, this.sort.direction);
    this.baseListService.setDateRange(this.filterRangeDate);
    this.clearCurrent();
  }

  isLastPage() {
    if (this.ordersMeta) {
      return (this.currentPage * this.perPage > this.ordersMeta.totalItems);
    }
    return false;
  }

  perPageChanged() {
    this.baseListService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadOrders();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.baseListService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadOrders();
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
      autoHeight: true,
      sortable: false,
      filter: false,
      cellStyle: { 'white-space': 'normal' }
    };

    let cDef = null;
    if (_.findIndex(this.schema, { ColumnName: 'Id' }) === -1) {
      cDef = this.gridUtils.getColumnDefBySchema({ ColumnName: 'id' });
      this.agColumnDefs.push(cDef);
    }
    this.schema.forEach(obj => {
      cDef = this.gridUtils.getColumnDefBySchema(obj);
      cDef.headerName = obj.ColumnDesc || cDef.headerName;
      cDef.minWidth = obj.Width || cDef.minWidth;
      cDef.maxWidth = obj.Width || cDef.maxWidth;
      if (cDef) {
        this.agColumnDefs.push(cDef);
      } else {
        console.log('Column not defined', obj);
      }
    });

    if (this.schema.length === 0) {
      this.agColumnDefs = [
        {
          headerName: this.translate.instant('APP.FIELD.id'),
          field: 'id',
          minWidth: 70, maxWidth: 70
        },
        {
          headerName: this.translate.instant('APP.FIELD.numero'),
          field: 'numero',
          minWidth: 70, maxWidth: 70,
        },
        {
          headerName: this.translate.instant('APP.FIELD.sezionaleDescrizione'),
          field: 'sezionaleDescrizione',
          minWidth: 140, maxWidth: 140,
        },
        {
          headerName: this.translate.instant('APP.FIELD.dataCreazione'),
          field: 'dataCreazione',
          minWidth: 110, maxWidth: 110,
          cellRenderer: function (params) {
            const cssClass = '';
            const date = params.data['dataCreazione'] ? moment(params.data['dataCreazione'], 'YYYY-MM-DD').format('DD-MM-YYYY') : '';
            return '<span class="' + cssClass + '">' + date + '</span>';
          }
        },
        {
          headerName: this.translate.instant('APP.FIELD.dataPrevistaEvasione'),
          field: 'dataPrevistaEvasione',
          minWidth: 110, maxWidth: 110,
          cellRenderer: function (params) {
            const cssClass = '';
            // tslint:disable-next-line: max-line-length
            const date = params.data['dataPrevistaEvasione'] ? moment(params.data['dataPrevistaEvasione'], 'YYYY-MM-DD').format('DD-MM-YYYY') : '';
            return '<span class="' + cssClass + '">' + date + '</span>';
          }
        },
        {
          headerName: this.translate.instant('APP.FIELD.stato'),
          field: 'stato',
          minWidth: 90, maxWidth: 90,
          cellStyle: { 'white-space': 'normal' },
          cellRenderer: function(params) {
            const cssClass = 'badge badge-success';
            return '<span class="' + cssClass + '">' + params.data['stato'] + '</span>';
          }
        },
        {
          headerName: this.translate.instant('APP.FIELD.categoriaDocumentoDescrizione'),
          field: 'categoriaDocumentoDescrizione',
          minWidth: 110, maxWidth: 110
        },
        {
          headerName: this.translate.instant('APP.FIELD.titoloPreventivo'),
          field: 'titoloPreventivo',
          minWidth: 120
        },
        {
          headerName: this.translate.instant('APP.FIELD.nominativoIntestatario'),
          field: 'nominativoIntestatario',
          minWidth: 120
        },
        {
          headerName: this.translate.instant('APP.FIELD.nominativoFatturazione'),
          field: 'nominativoFatturazione',
          minWidth: 120
        },
        {
          headerName: this.translate.instant('APP.FIELD.nominativoDestinazione'),
          field: 'nominativoDestinazione',
          minWidth: 120
        },
        {
          headerName: this.translate.instant('APP.FIELD.riferimentoCliente'),
          field: 'riferimentoCliente',
          minWidth: 90
        },
        {
          headerName: this.translate.instant('APP.FIELD.responsabile'),
          field: 'responsabile',
          minWidth: 90, maxWidth: 90
        },
        {
          headerName: this.translate.instant('APP.FIELD.riferimentoCommerciale'),
          field: 'riferimentoCommerciale',
          minWidth: 90, maxWidth: 90
        },
        {
          headerName: this.translate.instant('APP.FIELD.quantitaOrdinata'),
          field: 'quantitaOrdinata',
          minWidth: 90, maxWidth: 90,
          cellClass: 'text-right'
        },
        {
          headerName: this.translate.instant('APP.FIELD.quantitaCaricata'),
          field: 'quantitaCaricata',
          minWidth: 90, maxWidth: 90,
          cellClass: 'text-right'
        },
        {
          headerName: this.translate.instant('APP.FIELD.quantitaOrdinataAFornitore'),
          field: 'quantitaOrdinataAFornitore',
          minWidth: 90, maxWidth: 90,
          cellClass: 'text-right'
        },
        {
          headerName: this.translate.instant('APP.FIELD.totaleLordoCliente'),
          field: 'totaleLordoCliente',
          minWidth: 100, maxWidth: 100,
          cellRenderer: function (params) {
            const cssClass = 'pull-right';
            const currency = formatCurrency(params.data['totaleLordoCliente'], 'IT', '', 'EUR');
            return '<span class="' + cssClass + '">' + currency + '</span>';
          }
        },
        {
          headerName: this.translate.instant('APP.FIELD.totaleIvaCliente'),
          field: 'totaleLortotaleIvaClientedoCliente',
          minWidth: 100, maxWidth: 100,
          cellRenderer: function (params) {
            const cssClass = 'pull-right';
            const currency = formatCurrency(params.data['totaleIvaCliente'], 'IT', '', 'EUR');
            return '<span class="' + cssClass + '">' + currency + '</span>';
          }
        },
        {
          headerName: this.translate.instant('APP.FIELD.numeroRigheDettaglio'),
          field: 'numeroRigheDettaglio',
          minWidth: 70, maxWidth: 70,
          cellClass: 'text-right'
        },
        {
          headerName: this.translate.instant('APP.FIELD.statoValore'),
          field: 'statoValore',
          minWidth: 70, maxWidth: 70,
          cellClass: 'text-right'
        },
        {
          headerName: this.translate.instant('APP.FIELD.statoDescrizione'),
          field: 'statoDescrizione',
          minWidth: 90
        }
      ];
    }

    this.agGridOptions = {
      rowSelection: 'single',
      rowMultiSelectWithClick: false,
      suppressMultiSort: true,
      localeTextFunc: this.utilsService.localeTextFunc.bind(this),
      getRowNodeId: function (data) {
        return data.id;
      },
      // rowClassRules: {
      //   'item-deactive': function (params) { return !params.data.isActive; }
      // },
      // getRowStyle: params => {
      //   if (params.node.rowIndex % 2 === 0) {
      //     return { 'background-color': 'rgba(200, 33, 200, 0.2)' };
      //   }
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
    // const gridWidth = document.getElementById('grid-wrapper').offsetWidth;
    // const columnsToShow = [];
    // const columnsToHide = [];
    // let totalColsWidth = 0;
    // const allColumns = params.columnApi.getAllColumns();
    // for (let i = 0; i < allColumns.length; i++) {
    //   const column = allColumns[i];
    //   totalColsWidth += column.getMinWidth();
    //   if (totalColsWidth > gridWidth) {
    //     columnsToHide.push(column.colId);
    //   } else {
    //     columnsToShow.push(column.colId);
    //   }
    // }
    // params.columnApi.setColumnsVisible(columnsToShow, true);
    // params.columnApi.setColumnsVisible(columnsToHide, false);
    // if (!this.panelIsOpen) {
    //   // params.api.sizeColumnsToFit();
    //   params.api.resetRowHeights();
    // }
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

  onSortChanged(event) {
    const sortState = this.gridApi.getSortModel();
    if (sortState.length === 0) {
      this.baseListService.setSort(this.baseListService.sortDefault.column, this.baseListService.sortDefault.direction);
    } else {
      const item = sortState[0];
      this.baseListService.setSort(item.colId, item.sort);
      // console.log('State of sorting is:', item);
      // for (let i = 0; i < sortState.length; i++) {
      //   const item = sortState[i];
      //   console.log(i + ' = {colId: ' + item.colId + ', sort: ' + item.sort + '}');
      // }
    }
    this.loadOrders();
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
        // {
        //   colId: 'id',
        //   pinned: 'left',
        // },
        {
          colId: 'numero',
          pinned: 'left',
        },
        {
          colId: 'sezionaleDescrizione',
          pinned: 'left',
        },
        // {
        //   colId: 'dataCreazione',
        //   pinned: 'left',
        // },
        {
          colId: 'totaleLordoCliente',
          pinned: 'right',
        },
        {
          colId: 'totaleIvaCliente',
          pinned: 'right',
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
    this.currentOrder = this.panelIsOpen ? this.currentElement : null;
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

  applyFilterRange(event) {
    this.filterRangeDate = { dataInizio: event.dateStart, dataFine: event.dateEnd };
    this.baseListService.setDateRange(this.filterRangeDate);
    this.refresh();
  }

  clearFilterSort() {
    const oneEmit = this.hasFilter || this.hasSorting;
    if (oneEmit) {
      this.filterData = '';
      this.hasFilter = false;
      this.hasSorting = false;
      this.sort = { column: 'numero', direction: 'asc' };
      // this.sortingComponent.clearSorting(false);
      // this.ordersFilterComponent.clearFilter(true);
    }
  }

  onGroupSorting($event) {
    this.sort.column = $event.column;
    this.sort.direction = $event.direction;
    this.baseListService.setSort($event.field, $event.direction);
    this.hasSorting = ($event.field && $event.field !== '');
    this.refresh();
  }

  isSortAsc() {
    return (this.sort.direction === 'asc');
  }

  onGroupFilters($event) {
    const filter = '';
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
    // this.baseListService.setFilterSearch(filter);
    this.hasFilter = (filter !== '');
    this.filterData = filter;
    this.refresh();
  }

  // Print

  openPrintModal($event) {
    $event.preventDefault();
    $event.stopPropagation();

    // const initialState = {
    //   model: 'order'
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
