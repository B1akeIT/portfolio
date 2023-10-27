import { Component, Input, OnInit } from '@angular/core';
import { formatCurrency } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';
import { DdtService } from '../../ddt/ddt.service';

import { APP_CONST } from '@app/shared';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-invoice-ddts',
  templateUrl: 'invoice-ddts.component.html',
  styleUrls: ['./invoice-ddts.component.scss']
})
export class InvoiceDdtsComponent implements OnInit {

  @Input() invoiceId = null;
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
  sort = { column: 'id', direction: 'desc' };
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

  ddts = [];
  schema = [];
  ddtsMeta = null;
  currentInvoice = null;

  limit = 0;
  perPage = 50;
  currentPage = 1;

  maxPages = 5;
  numPages = 0;
  countTranslateParams = { count: '', total: '' };

  selectPerPage = APP_CONST.defaultPagination.perPageArr;

  showView = false;
  showDateRange = false;
  showSorting = false;
  showSearch = false;

  constructor(
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private ddtService: DdtService,
    public gridUtils: GridUtils
  ) {
  }

  ngOnInit(): void {
    const tenant = this.authenticationService.getCurrentTenant();

    this.ddtService.setTenent(tenant);
    this.initData();
  }

  initData() {
    // Init Data
    this.loading = true;

    this.user = this.authenticationService.getUserTenant();

    // RicercaDocumentoDiTrasportoView || RicercaFattureTestataView
    this.ddtService.getGrid('ListaDocumentiEvasiCollegati').subscribe(
      (response: any) => {
        if (response && response.schemaDescription) {
          const jsonSchema = JSON.parse(response.schemaDescription)[0];
          const columnSchemas = JSON.parse(jsonSchema.ColumnSchemas);
          const visibilityStatus = JSON.parse(jsonSchema.VisibilityStatus);
          let invoiceColumns = null;
          if (visibilityStatus !== 0) {
            const gridStatus = JSON.parse(jsonSchema.GridStatus);
            invoiceColumns = gridStatus.columns;
          }
          // const filterStatus = JSON.parse(jsonSchema.FilterStatus);

          // this.schema = columnSchemas;
          this.schema = columnSchemas.filter(elem => {
            const visibilityItem = _.findIndex(visibilityStatus, { 'columnName': elem.ColumnName, 'isVisible': true });
            return (visibilityItem !== -1);
          });

          if (visibilityStatus !== 0) {
            this.schema.sort((a: any, b: any) => {
              const aObj = _.find(invoiceColumns, { 'columnName': a.ColumnName });
              const bObj = _.find(invoiceColumns, { 'columnName': b.ColumnName });
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
    // console.log('onFilterChanged', event);
    this.ddtService.setQuery(event);
    this.loadDdts();
  }

  loadDdts() {
    this.loading = true;
    this.ddtService.getDocumentsJsonByDocument(this.invoiceId, this.tipoDocumentoId, this.macroTipoDocumento, this.aziendaId).subscribe(
      (response: any) => {
        const _result = response.items;
        this.ddts = _result ? _result.map(item => this.gridUtils.renameJson(item)) : [];
        this.ddtsMeta = response.meta || null;
        if (this.ddtsMeta && this.ddtsMeta.totalItems) {
          this.numPages = Math.ceil(this.ddtsMeta.totalItems / this.perPage);
          const fromCount = (this.currentPage - 1) * this.perPage + 1;
          const toCount = this.isLastPage() ? this.ddtsMeta.totalItems : this.currentPage * this.perPage;
          const count = fromCount + ' - ' + toCount;
          this.countTranslateParams = {
            count: count,
            total: this.ddtsMeta.totalItems
          };
        } else {
          this.numPages = 0;
          const count = String(this.ddts.length);
          const total = String(this.ddts.length);
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
    this.loadDdts();
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
    this.currentInvoice = null;
  }

  isOwner() {
    return (this.user?.aziendaId === this.currentElement?.aziendaInserimentoId);
  }

  resetPagination() {
    this.limit = APP_CONST.defaultPagination.limit;
    // this.perPage = APP_CONST.defaultPagination.perPage;
    this.maxPages = APP_CONST.defaultPagination.maxPages;
    this.currentPage = 1;
    this.ddtService.setLimit(this.limit);
    this.ddtService.setPerPage(this.perPage);
    this.ddtService.setPage(this.currentPage);
    this.ddtService.setFilterSearch(this.filterData);
    this.ddtService.setFilterQuery(this.query);
    this.ddtService.setSort(this.sort.column, this.sort.direction);
    this.ddtService.setDateRange(this.filterRangeDate);
    this.clearCurrent();
  }

  isLastPage() {
    if (this.ddtsMeta) {
      return (this.currentPage * this.perPage > this.ddtsMeta.totalItems);
    }
    return false;
  }

  perPageChanged() {
    this.ddtService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadDdts();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.ddtService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadDdts();
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
      this.ddtService.setSort(this.ddtService.sortDefault.column, this.ddtService.sortDefault.direction);
      // console.log('No sort active');
    } else {
      const item = sortState[0];
      this.ddtService.setSort(item.colId, item.sort);
    }
    this.loadDdts();
  }

  onDoubleClicked(params) {
    this.onShow();
  }

  onShow() {
    console.log('onShow', this.currentElement);
  }

  applyFilterRange(event) {
    this.filterRangeDate = { dataInizio: event.dateStart, dataFine: event.dateEnd };
    this.ddtService.setDateRange(this.filterRangeDate);
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
    this.ddtService.setSort($event.field, $event.direction);
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
