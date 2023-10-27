import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { TablesService } from '@app/views/tables/tables.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { QuotesService } from '../quotes.service';
import { GridUtils } from '@app/utils/grid-utils';
import { LookupService } from '@app/services/lookup.service';

import { ModalQuoteEditComponent } from '@app/views/quotes/modal-quote-item/modal-quote-item.component';

import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { QuoteItem } from '../../../models/quote-item.model';

import { RowNode, ValueSetterParams } from 'ag-grid-community';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-quote-body',
  templateUrl: './quote-body.component.html',
  styleUrls: ['./quote-body.component.scss']
})
export class QuoteBodyComponent implements OnInit, OnChanges {

  @Input() quoteId: number | null = null;
  @Input() itemList: any[] | null = null;
  @Input() clientId: number | null = null;
  @Input() sortable: boolean = false;
  @Input() filter: boolean = false;
  @Input() editable: boolean = false;
  @Input() multiSelection: boolean = false;
  @Input() checkboxSelection: boolean = false;
  @Input() showDisabledCheckboxes: boolean = false;
  @Input() testataModified: boolean = false;
  @Input() options: any = { height: '250px' };
  @Input() excludeOrderedRows: boolean = false;

  @Output() totali: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  model = 'quote-details';

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  user = null;

  gridInitialized = false;
  agDefaultColumnDefs = null;
  agColumnDefs = [];
  agGridOptions = {};

  selectedRows = [];

  gridApi;
  gridColumnApi;

  gridPinned = false;

  allItems = [];
  items = [];
  schema = [];
  itemsMeta = null;

  currentIndex = -1;
  currentId = 0;
  currentItem = null;

  limit = 0;
  perPage = 50;
  currentPage = 1;

  maxPages = 5;
  numPages = 0;
  countTranslateParams = { count: '', total: '' };

  modalRef: BsModalRef;

  quickAdd: boolean = false;
  quickForm: FormGroup = new FormGroup({});
  quickData: any = {};

  items$: Observable<any>;
  itemsLoading = false;
  itemsInput$ = new Subject<string>();
  selectedItems: any;
  minLengthTerm = 3;
  minTranslateParams = { min: this.minLengthTerm };

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private quotesService: QuotesService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    private gridUtils: GridUtils,
    private lookupService: LookupService,
    private fb: FormBuilder
  ) {
    this.user = this.authenticationService.getUserTenant();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.quoteId) {
      this.quoteId = changes.quoteId.currentValue;
      if (!changes.quoteId.firstChange) {
        this.loadQuoteDetails();
      }
    }
    if (changes.excludeOrderedRows) {
      this.excludeOrderedRows = changes.excludeOrderedRows.currentValue;
      if (!changes.excludeOrderedRows.firstChange) {
        this.toggleExcludeFilter();
      }
    }
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();
    // this.quotesService.reset();
    // this.quotesService.setTenent(tenant);

    this.lookupService.reset();
    this.lookupService.setTenent(tenant);

    this.loadArticoli();

    this.quotesService.getGrid('RicercaPreventivoDettaglioView').subscribe(
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
        this.error = true;
        this.errorMessage = error.message;
      }
    );
  }

  loadQuoteDetails() {
    this.loading = true;
    this.clearCurrent();
    this.quotesService.getQuoteDetails(this.quoteId).subscribe(
      (response: any) => {
        this.allItems = response.items;
        this.toggleExcludeFilter();

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
    if (this.itemList) {
      this.allItems = this.itemList || [];
      this.toggleExcludeFilter();
    } else {
      this.loadQuoteDetails();
    }
  }

  dummyAction(event) {
    console.log('dummyAction', event);
  }

  isLastPage() {
    if (this.itemsMeta) {
      return (this.currentPage * this.perPage > this.itemsMeta.totalItems);
    }
    return false;
  }

  perPageChanged() {
    this.quotesService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadQuoteDetails();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.quotesService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadQuoteDetails();
  }

  setCurrentItem(i, element) {
    if (!element || this.currentId === element.id) {
      this.clearCurrent();
    } else {
      this.currentIndex = i;
      this.currentId = element.id;
      this.currentItem = element;
    }
  }

  clearCurrent() {
    this.error = false;
    this.errorMessage = '';
    this.currentIndex = -1;
    this.currentId = 0;
    this.currentItem = null;
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
      sortable: this.sortable,
      filter: this.filter,
      editable: false,
      cellStyle: { 'white-space': 'normal' },
      // resizable: true
    };

    let cDef = this.gridUtils.getColumnDefBySchema({ ColumnName: 'id' });
    cDef.headerCheckboxSelection = this.multiSelection;
    // cDef.showDisabledCheckboxes = this.multiSelection;
    cDef.checkboxSelection = this.multiSelection;
    cDef.minWidth = 90;
    cDef.maxWidth = 90;
    this.agColumnDefs.push(cDef);
    this.schema.forEach(obj => {
      cDef = this.gridUtils.getColumnDefBySchema(obj);
      cDef.headerName = obj.ColumnDesc || cDef.headerName;
      cDef.minWidth = obj.Width || cDef.minWidth;
      cDef.maxWidth = obj.Width || cDef.maxWidth;
      if (cDef) {
        switch (cDef.field) {
          case 'quantita':
            if (this.multiSelection) {
              cDef.editable = true;
              cDef.valueSetter = (params: ValueSetterParams) => {  //to make sure user entered number only
                var newValInt = parseInt(params.newValue);
                var valueChanged = params.data.quantita !== newValInt;
                if (valueChanged) {
                  params.data.quantita = newValInt ? newValInt : params.oldValue;
                }
                return valueChanged;
              };
              cDef.cellClass = "bg-gray-100";
            }
            break;
        }
        this.agColumnDefs.push(cDef);
      } else {
        console.log('Column not defined', obj);
      }
    });

    this.agGridOptions = {
      rowSelection: this.multiSelection ? 'multiple' : 'single',
      rowMultiSelectWithClick: this.multiSelection ? true : false,
      // showDisabledCheckboxes: this.showDisabledCheckboxes,
      suppressMultiSort: true,
      localeTextFunc: this.utilsService.localeTextFunc.bind(this),
      getRowNodeId: function (data) {
        return data.id;
      },
      // rowClassRules: {
      //   'item-deactive': function (params) { return !params.data.isActive; }
      // },
      getRowStyle: params => {
        if (params.data.quantitaOrdinabile === 0) {
          return { background: '#f1f1f1' };
        }
      },
      navigateToNextCell: this.utilsService.navigateToNextCell.bind(this),
      animateRows: true
    };
    this.gridInitialized = true;
  }

  generatePinnedBottomData() {
    // generate a row-data with null values
    const result = {};

    this.gridColumnApi.getAllGridColumns().forEach(item => {
      result[item.colId] = null;
    });
    return this.calculatePinnedBottomData(result);
  }

  calculatePinnedBottomData(target: any) {
    const columnsWithAggregation = ['prezzoTotale', 'totaleIvaCliente'];
    columnsWithAggregation.forEach(element => {
      this.gridApi.forEachNodeAfterFilter((rowNode: RowNode) => {
        if (rowNode.data[element]) {
          target[element] += Number(rowNode.data[element].toFixed(2));
        }
      });
      if (target[element]) {
        target[element] = target[element].toFixed(2);
      }
    });

    this.totali.emit({
      prezzoTotale: target['prezzoTotale'],
      totaleIvaCliente: target['totaleIvaCliente']
    });

    return target;
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
    // sizeColumnsToFit / resetRowHeights;
  }

  onSelectionChanged(event) {
    const $this = this;
    const selectedRows = this.gridApi.getSelectedRows();
    selectedRows.forEach(function (selectedRow, index) {
      // multiple selction - not managed
      if (index === 0) {
        $this.setCurrentItem(index, selectedRow);
      }
    });
    if (selectedRows.length === 0) {
      this.setCurrentItem(0, null);
      this.selectedRows = [];
    } else {
      this.selectedRows = selectedRows;
    }
    this.selected.emit(this.selectedRows);
  }

  onSortChanged(event) {
    const sortState = this.gridApi.getSortModel();
    if (sortState.length === 0) {
      this.quotesService.setSort(this.quotesService.sortDefault.column, this.quotesService.sortDefault.direction);
    } else {
      const item = sortState[0];
      this.quotesService.setSort(item.colId, item.sort);
    }
    this.loadQuoteDetails();
  }

  onDoubleClicked(params) {
    if (!this.multiSelection) {
      this.onEdit();
    }
  }

  setNewData(id, data) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(id);
      if (rowNode) { rowNode.setData(data); }
    }
  }

  buildQuickForm(): void {
    this.quickForm = this.fb.group({
      articoloId: new FormControl(null, [Validators.required]),
      quantita: new FormControl(null, [Validators.required])
    });
  }

  onQuickAdd() {
    this.buildQuickForm();
    this.quickData = new QuoteItem({
      preventivoTestataId: this.quoteId,
      numeroRiga: this.items.length + 1,
    });
    this.quickAdd = true;
  }

  onQuickSave(values: any) {
    // this.quickData = this.gridUtils.renameJson(this.quickData);
    this.quickData.quantita = Number(values.quantita) || 0;
    if (this.quickData.quantita > 0) {
      const body = this.quickData;
      this.quotesService.saveArticolo(0, body).subscribe(
        ((response: any) => {
          this.items = response.dettagliList;
          this.save.emit(response);
          this.quickAdd = false;
          this.refresh();
        }),
        (error => {
          const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
          const message = error.message;
          this.notificationService.error(message, title);
        })
      );
    } else {
      this.notificationService.warn('APP.MESSAGE.warn_save_quote_item', 'APP.TITLE.quote');
    }
  }

  onArticoloChange(event: any) {
    const data = event ? this.gridUtils.renameJson(event) : {};
    this.quickData = new QuoteItem({
      preventivoTestataId: this.quoteId,
      numeroRiga: this.items.length + 1,
      ...data
    });
  }

  trackByItems(item: any) {
    return item.id;
  }

  customSearchFn(term, item) {
    term = term.toLowerCase();
    return item.descrizione.toLowerCase().indexOf(term) > -1;
  }

  loadArticoli() {
    this.items$ = concat(
      of([]), // default items
      this.itemsInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.itemsLoading = true),
        switchMap(term => {
          this.lookupService.setQuery(term);
          const _item = { clienteId: this.clientId };
          return this.lookupService.getListCombo('SpComboArticoloLookUp', _item).pipe(
            map(response => {
              return response.items;
            }),
            catchError(() => of([])), // empty list on error
            tap(() => this.itemsLoading = false)
          );
          // return this.quotesService.getArticoliForAutocomple(term).pipe(
          //   catchError(() => of([])), // empty list on error
          //   tap(() => this.itemsLoading = false)
          // );
        })
      )
    );
  }

  onCloseQuickAdd() {
    this.quickAdd = false;
  }

  onDelete() {
    if (this.currentItem) {
      this.quotesService.deleteQuoteItem(this.currentItem.id).subscribe(
        (response) => {
          this.delete.emit(response);
          this.refresh();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onEdit(isNew = false) {
    if (this.testataModified) {
      this.notificationService.warn('APP.MESSAGE.warn_save_preventivo', 'APP.TITLE.quote');
    } else {
      if (isNew) {
        this.clearCurrent();
      }
      this.openModal(isNew);
    }
  }

  openModal(isNew = false) {
    const title = (isNew) ? 'APP.TITLE.new_item_row' : 'APP.TITLE.edit_item_row';
    const initialState = {
      itemId: (isNew) ? null : (this.currentItem?.id || null),
      quoteId: this.quoteId,
      clientId: this.clientId,
      numeroRiga: this.items.length + 1,
      title: title,
      showHeader: false,
      showFooter: false
    };
    this.modalRef = this.modalService.show(ModalQuoteEditComponent, {
      ignoreBackdropClick: true,
      class: 'modal-full-height',
      initialState: initialState
    });
    this.modalRef.content.onClose.subscribe(
      (result: any) => {
        this.items = result.items;
        this.refresh();
        this.save.emit(result);
      }
    );
  }

  toggleExcludeFilter() {
    let _items = [];
    if (this.excludeOrderedRows) {
      if (this.allItems) {
        _items = this.allItems.filter(item => item.QuantitaOrdinabile > 0);
      }
    } else {
      _items = this.allItems ? [ ...this.allItems ] : [];
    }
    this.items = _items.map(item => this.gridUtils.renameJson(item));
  }
}
