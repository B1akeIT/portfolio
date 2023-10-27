import { Component, Input, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { QuotesService } from '../../quotes/quotes.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-contact-quotes',
  templateUrl: 'contact-quotes.component.html',
  styleUrls: ['./contact-quotes.component.scss']
})
export class ContactQuotesComponent implements OnInit {

  @Input() contactId = null;

  model = 'quotes';

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

  quotes = [];
  schema = [];
  quotesMeta = null;
  currentQuote = null;

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
    private quotesService: QuotesService,
    public gridUtils: GridUtils
  ) {
  }

  ngOnInit(): void {
    const tenant = this.authenticationService.getCurrentTenant();

    this.quotesService.reset();
    this.quotesService.setTenent(tenant);
    this.initData();
  }

  initData() {
    // Init Data
    this.loading = true;

    this.user = this.authenticationService.getUserTenant();

    this.quotesService.getGrid('ListaPreventiviCollegati').subscribe(
      (response: any) => {
        if (response && response.schemaDescription) {
          const jsonSchema = JSON.parse(response.schemaDescription)[0];
          const columnSchemas = JSON.parse(jsonSchema.ColumnSchemas);
          const visibilityStatus = JSON.parse(jsonSchema.VisibilityStatus);
          const gridStatus = JSON.parse(jsonSchema.GridStatus);
          const orderColumns = gridStatus.columns;
          // const filterStatus = JSON.parse(jsonSchema.FilterStatus);

          // this.schema = columnSchemas;
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

  onFilterChanged(event) {
    // console.log('onFilterChanged', event);
    this.quotesService.setQuery(event);
    this.loadQuotes();
  }

  loadQuotes() {
    this.loading = true;
    this.quotesService.getQuotesContact(this.contactId).subscribe(
      (response: any) => {
        const _result = response;
        this.quotes = _result ? _result.map(item => this.gridUtils.renameJson(item)) : [];
        this.quotesMeta = _result ? _result.meta : null;
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
    this.currentQuote = null;
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
      this.quotesService.setSort(this.quotesService.sortDefault.column, this.quotesService.sortDefault.direction);
      // console.log('No sort active');
    } else {
      const item = sortState[0];
      this.quotesService.setSort(item.colId, item.sort);
    }
    this.loadQuotes();
  }

  onDoubleClicked(params) {
    this.onShow();
  }

  onShow() {
    console.log('onShow', this.currentElement);
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
    this.refresh();
  }
}
