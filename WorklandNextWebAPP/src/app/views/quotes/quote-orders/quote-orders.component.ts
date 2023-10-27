import { Component, Input, OnInit } from '@angular/core';
import { formatCurrency } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';
import { OrdersService } from '../../orders/orders.service';

import { APP_CONST } from '@app/shared';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-quote-orders',
  templateUrl: 'quote-orders.component.html',
  styleUrls: ['./quote-orders.component.scss']
})
export class QuoteOrdersComponent implements OnInit {

  @Input() quoteId = null;
  @Input() tipoDocumentoId = null;
  @Input() macroTipoDocumento = null;
  @Input() aziendaId = null;

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  user = null;

  hasFilter = false;
  filterData = '';
  hasSorting = true;
  sort = { column: 'dataCreazione', direction: 'desc' };
  query = '';

  sortingFields = [
    'id',
    'dataCreazione',
    'dataScadenza'
  ];

  filterRangeDate = { dataInizio: '01-01-2011', dataFine: null };

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

  limit = 0;
  perPage = 50;
  currentPage = 1;

  maxPages = 5;
  numPages = 0;
  countTranslateParams = { count: '', total: '' };

  selectPerPage = APP_CONST.defaultPagination.perPageArr;

  showView = true;
  showDateRange = false;
  showSorting = false;
  showSearch = false;

  constructor(
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private ordersService: OrdersService,
    public gridUtils: GridUtils
  ) {
  }

  ngOnInit(): void {
    const tenant = this.authenticationService.getCurrentTenant();

    this.ordersService.setTenent(tenant);
    this.initData();
  }

  initData() {
    // Init Data
    this.loading = true;

    this.user = this.authenticationService.getUserTenant();

    this.ordersService.getGrid('ListaOrdiniClienteCollegati').subscribe(
      (response: any) => {
        if (response && response.schemaDescription) {
          const jsonSchema = JSON.parse(response.schemaDescription)[0];
          const columnSchemas = JSON.parse(jsonSchema.ColumnSchemas);
          const visibilityStatus = JSON.parse(jsonSchema.VisibilityStatus);
          let orderColumns = null;
          if (visibilityStatus !== 0) {
            const gridStatus = JSON.parse(jsonSchema.GridStatus);
            orderColumns = gridStatus.columns;
          }
          // const filterStatus = JSON.parse(jsonSchema.FilterStatus);

          // this.schema = columnSchemas;
          this.schema = columnSchemas.filter(elem => {
            const visibilityItem = _.findIndex(visibilityStatus, { 'columnName': elem.ColumnName, 'isVisible': true });
            return (visibilityItem !== -1);
          });

          if (visibilityStatus !== 0) {
            this.schema.sort((a: any, b: any) => {
              const aObj = _.find(orderColumns, { 'columnName': a.ColumnName });
              const bObj = _.find(orderColumns, { 'columnName': b.ColumnName });
              return aObj.position - bObj.position;
            });
          }
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

  onFilterChanged(event) {
    this.ordersService.setQuery(event);
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.ordersService.getOrderJsonByDocument(this.quoteId, this.tipoDocumentoId, this.macroTipoDocumento, this.aziendaId).subscribe(
      (response: any) => {
        const _result = response.items; // JSON.parse(response.jsonResult);
        this.orders = _result ? _result.map(item => this.gridUtils.renameJson(item)) : [];
        this.ordersMeta = response.meta || null;
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

  dummyAction(event) {
    console.log('dummyAction', event);
  }

  setCurrent(i, element) {
    if (!element || this.currentId === element.id) {
      this.clearCurrent();
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
      suppressMovable: true,
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
      navigateToNextCell: this.utilsService.navigateToNextCell.bind(this),
      animateRows: true
    };
  }

  onGridReady(params) {
    const $this = this;

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.resetRowHeights();

    window.addEventListener('resize', function () {
      setTimeout(function () {
        $this.gridApi.resetRowHeights();
      });
    });
  }

  onGridSizeChanged(params) {
  }

  onSelectionChanged(event) {
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
    this.onShow();
  }

  onShow() {
    console.log('onShow', this.currentElement);
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
    this.refresh();
  }
}
