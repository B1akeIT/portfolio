import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { formatCurrency } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { TablesService } from '@app/views/tables/tables.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { InvoicesService } from '../invoices.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ModalInvoiceEditComponent } from '@app/views/invoices/modal-invoice-item/modal-invoice-item.component';

import { InvoiceItem } from '../../../models/invoice-item.model';

import { RowNode } from 'ag-grid-community';

import { APP_CONST } from '@app/shared/const';

import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invoice-body',
  templateUrl: './invoice-body.component.html',
  styleUrls: ['./invoice-body.component.scss']
})
export class InvoiceBodyComponent implements OnInit, OnChanges {

  @Input() invoiceId: any = null;
  @Input() clientId: number | null = null;
  @Input() sortable: boolean = false;
  @Input() filter: boolean = false;
  @Input() editable: boolean = false;
  @Input() multiSelection: boolean = false;
  @Input() checkboxSelection: boolean = false;
  @Input() showDisabledCheckboxes: boolean = false;
  @Input() testataModified: boolean = false;
  @Input() notaCredito: boolean = false;
  @Input() invoice: any = null;
  @Input() options: any = { height: '250px' };

  @Output() totali: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  model = 'invoice-datails';

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
    private invoicesService: InvoicesService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    private gridUtils: GridUtils,
  ) {
    this.user = this.authenticationService.getUserTenant();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.invoiceId) {
      this.invoiceId = changes.invoiceId.currentValue;
      if (!changes.invoiceId.firstChange) {
        this.loadInvoiceDetails();
      }
    }
  }

  ngOnInit() {
    // const tenant = this.authenticationService.getCurrentTenant();
    // this.invoicesService.reset();
    // this.invoicesService.setTenent(tenant);

    this.invoicesService.getGrid('RicercaFatturaDettaglioView').subscribe(
      (response: any) => {
        if (response && response.schemaDescription) {
          const jsonSchema = JSON.parse(response.schemaDescription)[0];
          const columnSchemas = JSON.parse(jsonSchema.ColumnSchemas);
          const visibilityStatus = JSON.parse(jsonSchema.VisibilityStatus);
          const gridStatus = JSON.parse(jsonSchema.GridStatus);
          const invoiceColumns = gridStatus.columns;
          // const filterStatus = JSON.parse(jsonSchema.FilterStatus);

          this.schema = columnSchemas.filter(elem => {
            const visibilityItem = _.findIndex(visibilityStatus, { 'columnName': elem.ColumnName, 'isVisible': true });
            return (visibilityItem !== -1);
          });

          this.schema.sort((a: any, b: any) => {
            const aObj = _.find(invoiceColumns, { 'columnName': a.ColumnName });
            const bObj = _.find(invoiceColumns, { 'columnName': b.ColumnName });
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

  loadInvoiceDetails() {
    this.loading = true;
    this.clearCurrent();

    let req: Observable<any> = null;
    if (this.notaCredito && this.invoice) {
      req = this.invoicesService.getInvoiceDetailsNC(this.invoiceId, this.invoice);
    } else {
      req = this.invoicesService.getInvoiceDetails(this.invoiceId);
    }

    req.subscribe(
      (response: any) => {
        if (response && response.items) {
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

  refresh() {
    this.loadInvoiceDetails();
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
    this.invoicesService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadInvoiceDetails();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.invoicesService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadInvoiceDetails();
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
      cellStyle: { 'white-space': 'normal' }
    };

    let cDef = this.gridUtils.getColumnDefBySchema({ ColumnName: 'id' });
    cDef.headerCheckboxSelection = this.multiSelection;
    // cDef.showDisabledCheckboxes = this.multiSelection;
    cDef.checkboxSelection = this.multiSelection;
    this.agColumnDefs.push(cDef);
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
      this.invoicesService.setSort(this.invoicesService.sortDefault.column, this.invoicesService.sortDefault.direction);
    } else {
      const item = sortState[0];
      this.invoicesService.setSort(item.colId, item.sort);
    }
    this.loadInvoiceDetails();
  }

  onDoubleClicked(params) {
    this.onEdit();
  }

  setNewData(id, data) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(id);
      if (rowNode) { rowNode.setData(data); }
    }
  }

  onDelete() {
    if (this.currentItem) {
      this.invoicesService.deleteInvoiceItem(this.currentItem.id).subscribe(
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
      this.notificationService.warn('APP.MESSAGE.warn_save_ordine', 'APP.TITLE.invoice');
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
      invoiceId: this.invoiceId,
      clientId: this.clientId,
      numeroRiga: this.items.length + 1,
      title: title,
      showHeader: false,
      showFooter: false
    };
    this.modalRef = this.modalService.show(ModalInvoiceEditComponent, {
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
