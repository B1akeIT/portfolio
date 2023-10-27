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
import { TablesService } from '@app/views/tables/tables.service';
import { OrdersService } from './orders.service';
import { ResizableService } from '@app/services/resizable.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ModalCopyComponent } from '@app/components/modal-copy/modal-copy.component';
import { ModalCreateDocComponent } from './modal-create-doc/modal-create-doc.component';

import { APP_CONST } from '@app/shared';
import { Order } from '@app/models/order.model';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  templateUrl: 'orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  model = 'orders';

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

  sortingFields = [
    'id',
    'numero',
    'sezionaleDescrizione',
    'dataCreazione',
    'dataPrevistaEvasione',
    'stato',
    'categoriaDocumentoDescrizione',
    'titoloPreventivo',
    'nominativoIntestatario',
    'nominativoFatturazione',
    'nominativoDestinazione',
    'riferimentoCliente',
    'responsabile',
    'riferimentoCommerciale',
    'quantitaOrdinata',
    'quantitaCaricata',
    'quantitaOrdinataAFornitore',
    'totaleLordoCliente',
    'totaleIvaCliente',
    'numeroRigheDettaglio',
    'statoValore',
    'statoDescrizione'
  ];

  filterRangeDate = { dataInizio: '01-01-2011', dataFine: null };

  dateOptions = {
    format: 'dd-MM-yyyy'
  };

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
  modalCreateDocRef: BsModalRef;

  limit = 0;
  perPage = 50;
  currentPage = 1;

  maxPages = 5;
  numPages = 0;
  countTranslateParams = { count: '', total: '' };

  selectPerPage = APP_CONST.defaultPagination.perPageArr;

  rowModelType = 'serverSide';
  serverSideStoreType = 'partial';

  tenant = '';
  currentCompanyId = null;
  companies = [];

  multiSelection: boolean = true;

  anagraficheCombo = [];

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private tablesService: TablesService,
    private ordersService: OrdersService,
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
    this.tenant = this.authenticationService.getCurrentTenant();

    this.user = this.authenticationService.getUserTenant();
    this.currentCompanyId = this.user.aziendaId;
    this.ordersService.setAziendaId(this.currentCompanyId);

    const combos = [
      'SpComboTipoDocumentoDiEvasione',
      'SpComboAzienda'
    ];
    this.tablesService.setTenent(this.tenant);
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

    this.ordersService.reset();
    this.ordersService.setTenent(this.tenant);
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

    this.ordersService.getGrid('RicercaOrdineClienteTestataView').subscribe(
      (response: any) => {
        if (response && response.schemaDescription) {
          const jsonSchema = JSON.parse(response.schemaDescription)[0];
          const columnSchemas = JSON.parse(jsonSchema.ColumnSchemas);
          const visibilityStatus = JSON.parse(jsonSchema.VisibilityStatus);
          const gridStatus = JSON.parse(jsonSchema.GridStatus);
          // const filterStatus = JSON.parse(jsonSchema.FilterStatus);
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
    // console.log('Element was resized', event);
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
    this.ordersService.setQuery(event);
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    // this.ordersService.getJson(this.model)
    this.ordersService.getListModel().subscribe(
      (response: any) => {
        this.orders = (response.items || []).map(item => this.gridUtils.renameJson(item));
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
        model: 'order',
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
    // if (event.isNew) {
      this.loadOrders();
    // }
  }

  onDelete(confirm) {
    if (confirm) {
      let deleteObs = null;
      if (this.selectedRows.length > 1) {
        const body = this.selectedRows.map(item => item.id);
        deleteObs = this.ordersService.deleteSelected(body);
      } else {
        deleteObs = this.ordersService.deleteModel(this.currentId);
      }

      deleteObs.subscribe(
        (response: any) => {
          this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.orders');
          this.refresh();
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

  onMenuDocument(doc: any) {
    // this.notificationService.info(`${doc.id} - ${doc.descrizione}`, 'Genera documento');
    this.onCreateDoc(doc.id, doc.descrizione);
  }

  onCreateDoc(type: number, description: string) {
    if (this.selectedRows.length > 0) {
      const initialState = {
        id: this.currentId,
        model: 'order',
        document: type,
        documentDescription: description,
        item: this.currentElement,
        aziendaId: this.currentCompanyId,
        orderList: this.selectedRows.length > 1 ? this.selectedRows : []
      };

      this.modalCreateDocRef = this.modalService.show(ModalCreateDocComponent, {
        id: 9990,
        ignoreBackdropClick: false,
        class: 'modal-lg-full',
        initialState: initialState
      });
      this.modalCreateDocRef.content.onClose.subscribe(
        (result: any) => {
          this.refresh();
        }
      );
    } else {
      console.log('onCreateDoc', 'Select element');
    }
  }

  setCurrent(element) {
    if (!element || this.currentId === element.id) {
      this.clearCurrent();
      if (this.panelIsOpen) {
        // this.togglePanel();
      }
    } else {
      this.currentId = element.id;
      this.currentElement = element;
    }
  }

  clearCurrent() {
    this.error = false;
    this.errorMessage = '';
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
    this.ordersService.setLimit(this.limit);
    this.ordersService.setPerPage(this.perPage);
    this.ordersService.setPage(this.currentPage);
    this.ordersService.setFilterSearch(this.filterData);
    this.ordersService.setFilterQuery(this.query);
    this.ordersService.setSort(this.sort.column, this.sort.direction);
    this.ordersService.setDateRange(this.filterRangeDate);
    this.clearCurrent();
  }

  isLastPage() {
    if (this.ordersMeta) {
      return (this.currentPage * this.perPage > this.ordersMeta.totalItems);
    }
    return false;
  }

  perPageChanged() {
    this.ordersService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadOrders();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.ordersService.setPage(this.currentPage);
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
    this.agDefaultColumnDefs = {
      autoHeight: false,
      sortable: false,
      filter: false,
      cellStyle: { 'white-space': 'normal' }
    };

    let cDef = null;
    if (this.multiSelection) {
      cDef = this.gridUtils.getColumnDefBySchema({ ColumnName: 'checkbox' });
      this.agColumnDefs.push(cDef);
    }
    this.schema.forEach(obj => {
      cDef = this.gridUtils.getColumnDefBySchema(obj);
      cDef.headerName = obj.ColumnDesc;
      cDef.minWidth = obj.Width;
      cDef.maxWidth = obj.Width;
      if (cDef) {
        this.agColumnDefs.push(cDef);
      } else {
        console.log('Column not defined', obj);
      }
    });

    this.agGridOptions = {
      rowSelection: this.multiSelection ? 'multiple' : 'single',
      rowMultiSelectWithClick: false, // this.multiSelection ? true : false,
      suppressMultiSort: true,
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
      if (index === 0) {
        $this.setCurrent(selectedRow);
      }
    });
    if (selectedRows.length === 0) {
      this.setCurrent(null);
      this.selectedRows = [];
    } else {
      this.selectedRows = selectedRows;
    }
    // this.sideBarStatus = 'inspector';
  }

  onSortChanged(event) {
    const sortState = this.gridApi.getSortModel();
    if (sortState.length === 0) {
      this.ordersService.setSort(this.ordersService.sortDefault.column, this.ordersService.sortDefault.direction);
    } else {
      const item = sortState[0];
      this.ordersService.setSort(item.colId, item.sort);
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
        {
          colId: 'checkbox',
          pinned: 'left',
        },
        {
          colId: 'id',
          pinned: 'left',
        },
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
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'checkbox',
          pinned: 'left',
        }
      ],
      defaultState: { pinned: null }
    });
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
    this.ordersService.setDateRange(this.filterRangeDate);
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
    this.ordersService.setSort($event.field, $event.direction);
    this.hasSorting = ($event.field && $event.field !== '');
    this.refresh();
  }

  isSortAsc() {
    return (this.sort.direction === 'asc');
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
    // this.ordersService.setFilterSearch(filter);
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

  toggleMultiSelection() {
    this.multiSelection = !this.multiSelection;
    this.initGrid(true);
  }

  isSingleSelection() {
    return (this.selectedRows.length === 1);
  }

  isMultipleSelection() {
    return (this.selectedRows.length > 1);
  }

  onCompany(event) {
    this.currentCompanyId = event.id;
    this.ordersService.setAziendaId(this.currentCompanyId);
    this.clearCurrent();
    this.loadOrders();
  }
}
