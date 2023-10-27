import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { TablesService } from '@app/views/tables/tables.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { OrdersSuppliersService } from '../orders-suppliers.service';
import { GridUtils } from '@app/utils/grid-utils';
import { LookupService } from '@app/services/lookup.service';

import { ModalOrderSupplierItemComponent } from '@app/views/orders-suppliers/modal-order-supplier-item/modal-order-supplier-item.component';

import { OrderSupplier } from '../../../models/order-supplier.model';

import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { OrderItem } from '../../../models/order-item.model';

import { RowNode, RefreshCellsParams } from 'ag-grid-community';

import { APP_CONST } from '@app/shared/const';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-order-supplier-body',
  templateUrl: './order-supplier-body.component.html',
  styleUrls: ['./order-supplier-body.component.scss']
})
export class OrderSupplierBodyComponent implements OnInit, OnChanges {

  @Input() orderId: number | null = null;
  @Input() itemList: any[] | null = null;
  @Input() clientId: number | null = null;
  @Input() showToolbar = true;
  @Input() sortable: boolean = false;
  @Input() filter: boolean = false;
  @Input() editable: boolean = false;
  @Input() multiSelection: boolean = false;
  @Input() qtaEditable: boolean = true;
  @Input() checkboxSelection: boolean = false;
  @Input() showDisabledCheckboxes: boolean = false;
  @Input() testataModified = false;
  @Input() options = { height: '250px' };
  @Input() charge = false;

  @Output() totali: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter<any[]>();

  model = 'order-supplier-datails';

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  user = null;

  agDefaultColumnDefs = null;
  agColumnDefs = [];
  agGridOptions = {};

  selectedRows = [];

  gridApi;
  gridColumnApi;

  gridPinned = false;

  items = [];
  schema = [];
  itemsMeta = null;

  currentIndex = -1;
  currentId = 0;
  currentItem = null;

  limit = 0;
  perPage = 50;
  currentPage = 1;

  quickAdd: boolean = false;
  quickForm: FormGroup = new FormGroup({});
  quickData: any = {};

  items$: Observable<any>;
  itemsLoading = false;
  itemsInput$ = new Subject<string>();
  selectedItems: any;
  minLengthTerm = 3;
  minTranslateParams = { min: this.minLengthTerm };

  maxPages = 5;
  numPages = 0;
  countTranslateParams = { count: '', total: '' };

  modalRef: BsModalRef;

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private ordersService: OrdersSuppliersService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    private gridUtils: GridUtils,
    private lookupService: LookupService,
    private fb: FormBuilder
  ) {
    this.user = this.authenticationService.getUserTenant();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderId) {
      this.orderId = changes.orderId.currentValue;
      if (!changes.orderId.firstChange) {
        this.loadOrderDetails();
      }
    }
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();
    // this.ordersService.reset();
    // this.ordersService.setTenent(tenant);

    this.lookupService.reset();
    this.lookupService.setTenent(tenant);

    this.loadArticoli();

    this.ordersService.getGrid('RicercaOrdineFornitoreDettaglioView').subscribe(
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

  loadOrderDetails() {
    this.loading = true;
    this.clearCurrent();
    this.ordersService.getOrderDetails(this.orderId, this.charge).subscribe(
      (response: any) => {
        if (this.charge) {
          const result = JSON.parse(response.jsonResult);
          const items = (result && result.SpOrdineFornitoreRigheDaCaricare) ? result.SpOrdineFornitoreRigheDaCaricare : [];
          // this.items = this._fixResultKeys(items);
          this.items = items.map(item => this.gridUtils.renameJson(item));
        } else {
          this.items = response.items.map(item => this.gridUtils.renameJson(item));
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

  _fixResultKeys(result) {
    const newResult = [];
    result.forEach((item) => {
      const keys = Object.keys(item);
      keys.forEach((key) => {
        if (key !== 'id') {
          const newKey = _.lowerFirst(key);
          item[newKey] = item[key];
          delete item[key];
        }
      });

      newResult.push(item);
    });

    return newResult;
  }

  refresh() {
    this.loadOrderDetails();
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
    this.ordersService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadOrderDetails();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.ordersService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadOrderDetails();
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
      flex: 1,
      autoHeight: false,
      suppressMovable: true,
      sortable: this.sortable,
      filter: this.filter,
      editable: false,
      // cellStyle: { 'white-space': 'normal' }
      autoSizeAllColumns: false,
    };

    let cDef = this.gridUtils.getColumnDefBySchema({ ColumnName: 'id' });
    if (this.charge) {
      let checkDef: any = {
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        minWidth: 100, maxWidth: 100
      };
      cDef = { ...cDef, ...checkDef };
      this.agColumnDefs.push(cDef);
      cDef = this.gridUtils.getColumnDefBySchema({ ColumnName: 'quantitaDaAggiornare' });
      checkDef = {
        editable: true,
        type: 'numericColumn',
        cellClass: ['bg-gray-100', 'text-center'],
        valueParser: params => Number(params.newValue) || 0
      };
      cDef = { ...cDef, ...checkDef };
      this.agColumnDefs.push(cDef);
    } else {
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
      rowSelection: this.charge ? 'multiple' : 'single',
      rowMultiSelectWithClick: false,
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

    setTimeout(() => {
      this.setChargePinned();
      this.autoSizeAll(false);
    }, 500);
  }

  setChargePinned() {
    if (this.charge) {
      this.gridColumnApi.applyColumnState({
        state: [
          {
            colId: 'id',
            pinned: 'left',
          },
          {
            colId: 'quantitaDaAggiornare',
            pinned: 'left',
          }
        ],
        defaultState: { pinned: null },
      });
    }
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

  autoSizeAll(skipHeader: boolean) {
    const allColumnIds: string[] = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  onSelectionChanged(event) {
    const $this = this;
    const selectedRows = this.gridApi.getSelectedRows();
    if (!this.charge) {
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
    } else {
      selectedRows.forEach(function (selectedRow, index) {
        if (selectedRow.quantitaDaCaricare === 0) {
          selectedRow.quantitaDaCaricare = selectedRow.quantita - selectedRow.quantitaCaricata;
          $this.setNewData(selectedRow.id, selectedRow);
        }
      });
      // const params: RefreshCellsParams = {
      //   force: true,
      //   suppressFlash: true
      // };
      // this.gridApi.refreshCells(params);
      this.gridApi.redrawRows({ rowNodes: selectedRows });
    }

    this.selectionChanged.emit(selectedRows);
  }

  onSortChanged(event) {
    const sortState = this.gridApi.getSortModel();
    if (sortState.length === 0) {
      this.ordersService.setSort(this.ordersService.sortDefault.column, this.ordersService.sortDefault.direction);
    } else {
      const item = sortState[0];
      this.ordersService.setSort(item.colId, item.sort);
    }
    this.loadOrderDetails();
  }

  onDoubleClicked(params) {
    if (!this.charge && this.editable) {
      this.onEdit();
    }
  }

  setNewData(id, data) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(id);
      if (rowNode) {
        rowNode.setData(data);
      }
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
    this.quickData = new OrderItem({
      ordineFornitoreTestataId: this.orderId,
      numeroRiga: this.items.length + 1,
    });
    this.quickAdd = true;
  }

  onQuickSave(values: any) {
    // this.quickData = this.gridUtils.renameJson(this.quickData);
    this.quickData.quantita = Number(values.quantita) || 0;
    if (this.quickData.quantita > 0) {
      const body = this.quickData;
      this.ordersService.saveArticolo(0, body).subscribe(
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
    this.quickData = new OrderItem({
      ordineFornitoreTestataId: this.orderId,
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
      this.ordersService.deleteOrderItem(this.currentItem.id).subscribe(
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
      this.notificationService.warn('APP.MESSAGE.warn_save_ordine', 'APP.TITLE.order');
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
      orderId: this.orderId,
      numeroRiga: this.items.length + 1,
      title: title,
      showHeader: false,
      showFooter: false
    };
    this.modalRef = this.modalService.show(ModalOrderSupplierItemComponent, {
      ignoreBackdropClick: true,
      class: 'modal-full-height',
      initialState: initialState
    });
    this.modalRef.content.onClose.subscribe(
      (result: any) => {
        this.refresh();
        this.save.emit(result);
      }
    );
  }
}
