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
import { QuotesService } from './quotes.service';
import { CompaniesService } from '@app/views/companies/companies.service';
import { ResizableService } from '@app/services/resizable.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ModalCreateOrderComponent } from './modal-create-order/modal-create-order.component';
import { ModalCopyComponent } from '@app/components/modal-copy/modal-copy.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';

import { APP_CONST } from '@app/shared';
import { Quote } from '@app/models/quote.model';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  templateUrl: 'quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {

  model = 'quotes';

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
    'stato',
    'dataCreazione',
    'dataScadenza',
    'titolo',
    'categoriaDocumentoDescrizione',
    'nominativoIntestatario',
    'nominativoFatturazione',
    'nominativoDestinazione',
    'riferimentoCliente',
    'responsabile',
    'referente',
    'riferimentoCommerciale',
    'totaleLordoCliente',
    'totaleIvaCliente',
    'numeroRigheDettaglio',
    'statoValore',
    'statoDescrizione'
  ];

  filterRangeDate = { dataInizio: '01-01-2011', dataFine: null};

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

  quotes = [];
  schema = [];
  quotesMeta = null;
  currentQuote = null;

  quoteForm: FormGroup;
  quote: Quote;
  quoteFields: Array<FormlyFieldConfig>;
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

  limit = 0;
  perPage = 50;
  currentPage = 1;

  maxPages = 5;
  numPages = 0;
  countTranslateParams = { count: '', total: '' };

  selectPerPage = APP_CONST.defaultPagination.perPageArr;

  rowModelType = 'serverSide';
  serverSideStoreType = 'partial';

  modalPrintRef: BsModalRef;
  modalCreateOrdertRef: BsModalRef;
  modalCopyRef: BsModalRef;
  modalChoiceRef: BsModalRef;

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
    private quotesService: QuotesService,
    private companiesService: CompaniesService,
    public resizable: ResizableService,
    public gridUtils: GridUtils
  ) {
    this.eventsManagerService.on(APP_CONST.quoteUpdateEvent, (event) => {
      const quote = event;
      // const index = _.findIndex(this.quotes, { id: quote.id });
      this.setNewData(quote.id, quote);
    });
  }

  ngOnInit(): void {
    this.tenant = this.authenticationService.getCurrentTenant();

    this.user = this.authenticationService.getUserTenant();
    this.currentCompanyId = this.user.aziendaId;
    this.quotesService.setAziendaId(this.currentCompanyId);

    this.quotesService.reset();
    this.quotesService.setTenent(this.tenant);
    this.initData();

    // this.companiesService.reset();
    // this.companiesService.setTenent(this.tenant);
    // this.loadCompanies();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.tenant);

    const combos = [
      'SpComboAzienda',
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

    // Init Resizable Service
    // this.resizable.setElementRef(this.sidebarInspectorRef);
  }

  fxLayoutBodyHeight() {
    const hf = (this.fxlayoutConfig.header ? 40 : 0) + (this.fxlayoutConfig.footer ? 40 : 0);
    return `calc( 100% - ${hf}px )`;
  }

  initData() {
    this.loading = true;

    this.quotesService.getGrid('RicercaPreventivoTestataView').subscribe(
      (response: any) => {
        if (response && response.schemaDescription) {
          const jsonSchema = JSON.parse(response.schemaDescription)[0];
          const columnSchemas = JSON.parse(jsonSchema.ColumnSchemas);
          const visibilityStatus = JSON.parse(jsonSchema.VisibilityStatus);
          const gridStatus = JSON.parse(jsonSchema.GridStatus);
          const orderColumns = gridStatus.columns;
          // const filterStatus = JSON.parse(jsonSchema.FilterStatus);

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

  loadCompanies() {
    // this.loading = true;
    this.companiesService.getListModel().subscribe(
      (response: any) => {
        this.companies = (response || []);
        // this.loading = false;
      },
      (error: any) => {
        // this.loading = false;
      }
    );
  }

  onCompany(event) {
    this.currentCompanyId = event.id;
    this.quotesService.setAziendaId(this.currentCompanyId);
    this.clearCurrent();
    this.loadQuotes();
  }

  onFilterChanged(event) {
    this.quotesService.setQuery(event);
    this.loadQuotes();
  }

  loadQuotes() {
    this.loading = true;
    this.quotesService.getListModel().subscribe(
      (response: any) => {
        this.quotes = (response.items || []).map(item => this.gridUtils.renameJson(item));
        this.quotesMeta = response.meta;
        if (this.quotesMeta && this.quotesMeta.totalItems) {
          this.numPages = Math.ceil(this.quotesMeta.totalItems / this.perPage);
          const fromCount = (this.currentPage - 1) * this.perPage + 1;
          const toCount = this.isLastPage() ? this.quotesMeta.totalItems : this.currentPage * this.perPage;
          const count = fromCount + ' - ' + toCount;
          this.countTranslateParams = {
            count: count,
            total: this.quotesMeta.totalItems
          };
        } else {
          this.numPages = 0;
          const count = String(this.quotes.length);
          const total = String(this.quotes.length);
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
    this.loadQuotes();
  }

  onCreateOrder() {
    if (this.selectedRows.length > 0) {
      const initialState = {
        id: this.currentId,
        model: 'quote',
        item: this.currentElement,
        quoteList: this.selectedRows.length > 1 ? this.selectedRows : []
      };

      this.modalCreateOrdertRef = this.modalService.show(ModalCreateOrderComponent, {
        id: 9990,
        ignoreBackdropClick: false,
        class: 'modal-lg-full',
        initialState: initialState
      });
      this.modalCreateOrdertRef.content.onClose.subscribe(
        (result: any) => {
          this.refresh();
        }
      );
    } else {
      console.log('onCreateOrder', 'Select element');
    }
  }

  onCopy() {
    if (this.currentId) {
      const initialState = {
        id: this.currentId,
        model: 'quote',
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
    if (event.isNew) { this.loadQuotes(); }
  }

  onDelete(confirm) {
    if (confirm) {
      let deleteObs = null;
      if (this.selectedRows.length > 1) {
        const body = this.selectedRows.map(item => item.id);
        deleteObs = this.quotesService.deleteSelected(body);
      } else {
        deleteObs = this.quotesService.deleteModel(this.currentId);
      }

      deleteObs.subscribe(
        (response: any) => {
          this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.quotes');
          this.refresh();
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
    this.currentQuote = null;
    this.selectedRows = [];
  }

  isOwner() {
    return (this.user?.aziendaId === this.currentElement?.aziendaInserimentoId);
  }

  resetPagination() {
    this.limit = APP_CONST.defaultPagination.limit;
    // this.perPage = APP_CONST.defaultPagination.perPage;
    this.maxPages = APP_CONST.defaultPagination.maxPages;
    this.currentPage = 1;
    this.quotesService.setLimit(this.limit);
    this.quotesService.setPerPage(this.perPage);
    this.quotesService.setPage(this.currentPage);
    this.quotesService.setFilterSearch(this.filterData);
    this.quotesService.setFilterQuery(this.query);
    this.quotesService.setSort(this.sort.column, this.sort.direction);
    this.quotesService.setDateRange(this.filterRangeDate);
    this.clearCurrent();
  }

  isLastPage() {
    if (this.quotesMeta) {
      return (this.currentPage * this.perPage > this.quotesMeta.totalItems);
    }
    return false;
  }

  perPageChanged() {
    this.quotesService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadQuotes();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.quotesService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadQuotes();
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
      suppressMovable: true,
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
      cDef.headerName = obj.ColumnDesc || cDef.headerName;
      cDef.minWidth = obj.Width || cDef.minWidth;
      cDef.maxWidth = obj.Width || cDef.maxWidth;
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

  onSelectionChanged(event) {
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
  }

  onSortChanged(event) {
    const sortState = this.gridApi.getSortModel();
    if (sortState.length === 0) {
      this.quotesService.setSort(this.quotesService.sortDefault.column, this.quotesService.sortDefault.direction);
    } else {
      const item = sortState[0];
      this.quotesService.setSort(item.colId, item.sort);
    }
    this.loadQuotes();
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
        // {
        //   colId: 'dataCreazione',
        //   pinned: 'left',
        // },
        {
          colId: 'nominativoIntestatario',
          pinned: 'left',
        },
        {
          colId: 'completato',
          pinned: 'left',
        },
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
    this.currentQuote = this.panelIsOpen ? this.currentElement : null;
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
    this.quotesService.setDateRange(this.filterRangeDate);
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
      // this.quotesFilterComponent.clearFilter(true);
    }
  }

  onGroupSorting($event) {
    this.sort.column = $event.column;
    this.sort.direction = $event.direction;
    this.quotesService.setSort($event.field, $event.direction);
    this.hasSorting = ($event.field && $event.field !== '');
    this.refresh();
  }

  isSortAsc() {
    return (this.sort.direction === 'asc');
  }

  onGroupFilters($event) {
    // let filter = '';
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
    // this.quotesService.setFilterSearch(filter);
    // this.hasFilter = (filter !== '');
    // this.filterData = filter;
    this.refresh();
  }

  // Print

  openPrintModal($event) {
    $event.preventDefault();
    $event.stopPropagation();

    // const initialState = {
    //   model: 'quote'
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

  openChoiceModal(type) {
    let initialState = {};

    switch (type) {
      case 'intestatario':
        initialState = {
          model: type,
          nomeSp: 'SpComboContattoLookUp',
          item: {}
        };
        break;
      case 'fatturazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboClienteLookUp',
          item: {}
        };
        break;
      case 'destinazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboDestinazioneLookUp',
          item: {}
        };
        break;
    }

    this.modalChoiceRef = this.modalService.show(ModalLookupComponent, {
      ignoreBackdropClick: false,
      class: 'modal-lg-full',
      initialState: initialState
    });
    this.modalChoiceRef.content.onClose.subscribe(
      (result: any) => { }
    );
  }

  isClient() {
    let _isClient = false;
    if (this.currentElement !== null) {
      return this.currentElement.isCliente;
    }
    return _isClient;
  }

  hasClient() {
    let _isClient = false;
    this.selectedRows.forEach(item => {
      if (item.isCliente) {
        _isClient = true;
        return;
      }
    })
    return _isClient;
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
}
