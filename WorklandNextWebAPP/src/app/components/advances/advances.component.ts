import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { TablesService } from '@app/views/tables/tables.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { GridUtils } from '@app/utils/grid-utils';
import { AdvancesService } from '@app/services';

// import { ModalAdvanceEditComponent } from '@app/views/advances/modal-advance-item/modal-advance-item.component';

import { Observable, Subject } from 'rxjs';

import { Advance } from '@app/models/advance.model';

import { RowNode, ValueSetterParams } from 'ag-grid-community';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-advances',
  templateUrl: './advances.component.html',
  styleUrls: ['./advances.component.scss']
})
export class AdvancesComponent implements OnInit, OnChanges {

  @Input() clienteContabilitaId: number | null = null;
  @Input() documentoId: number | null = null;
  @Input() tipoDocumentoId: number | null = null;
  @Input() aziendaId: number | null = null;
  @Input() sortable: boolean = false;
  @Input() filter: boolean = false;
  @Input() showTitle: boolean = false;
  @Input() editable: boolean = false;
  @Input() multiSelection: boolean = false;
  @Input() checkboxSelection: boolean = false;
  @Input() options: any = { height: '250px' };

  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  model = 'advance';

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

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    private gridUtils: GridUtils,
    private advancesService: AdvancesService,
    private fb: FormBuilder
  ) {
    this.user = this.authenticationService.getUserTenant();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentoId) {
      this.documentoId = changes.documentoId.currentValue;
      if (!changes.documentoId.firstChange) {
        this.loadAdvances();
      }
    }
    if (changes.clienteContabilitaId) {
      this.clienteContabilitaId = changes.clienteContabilitaId.currentValue;
      if (!changes.clienteContabilitaId.firstChange) {
        this.loadAdvances();
      }
    }
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();
    this.advancesService.reset();
    this.advancesService.setTenent(tenant);

    this.advancesService.getGrid('RicercaAnticipoView').subscribe(
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

  loadAdvances() {
    this.loading = true;
    this.clearCurrent();
    this.advancesService.getAdvances(this.clienteContabilitaId, this.documentoId, this.tipoDocumentoId, this.aziendaId).subscribe(
      (response: any) => {
        const items = response.items || [];
        this.items = items.map(item => this.gridUtils.renameJson(item));

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
    this.loadAdvances();
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
    this.advancesService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadAdvances();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.advancesService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadAdvances();
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
    cDef.checkboxSelection = this.multiSelection;
    cDef.minWidth = 90;
    cDef.maxWidth = 90;
    this.agColumnDefs.push(cDef);
    /* The above code is incomplete and contains syntax errors. It appears to be written in TypeScript,
    but it is not clear what the purpose of the code is without additional context. The code starts
    with "this.schema.for" but it is not clear what property or method is being accessed on the
    "schema" object. The triple hash symbol " */
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
      rowMultiSelectWithClick: this.multiSelection ? true : false,
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
    this.gridInitialized = true;
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
      this.advancesService.setSort(this.advancesService.sortDefault.column, this.advancesService.sortDefault.direction);
    } else {
      const item = sortState[0];
      this.advancesService.setSort(item.colId, item.sort);
    }
    this.loadAdvances();
  }

  onDoubleClicked(params) {
    if (!this.multiSelection) {
      this.onQuickModify();
    }
  }

  setNewData(id, data) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(id);
      if (rowNode) { rowNode.setData(data); }
    }
  }

  buildQuickForm(data?: any): void {
    const _importo = data ? data.importo : null;
    const _dataPagamento = data ? moment(data.dataPagamento).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    const _note = data ? data.note : null;
    this.quickForm = this.fb.group({
      importo: new FormControl(_importo, [Validators.required]),
      dataPagamento: new FormControl(_dataPagamento, [Validators.required]),
      note: new FormControl(_note, [])
    });
  }

  onQuickAdd() {
    this.currentItem = null;
    this.buildQuickForm();
    this.quickData = new Advance({
      preventivoTestataId: (this.tipoDocumentoId === 10) ? this.documentoId : null,
      ordineClienteTestataId: (this.tipoDocumentoId === 9) ? this.documentoId : null,
      clienteContabilitaId: this.clienteContabilitaId
    });
    console.table(this.quickData);
    this.quickAdd = true;
  }

  onQuickModify() {
    this.buildQuickForm(this.currentItem);
    this.quickData = new Advance({ ...this.currentItem });
    this.quickAdd = true;
  }

  onQuickSave(values: any) {
    // this.quickData = this.gridUtils.renameJson(this.quickData);
    this.quickData.importo = parseFloat(values.importo) || 0;
    if (this.quickData.importo > 0) {
      const advance = this.quickData;
      advance.dataPagamento = moment(values.dataPagamento).format('YYYY-MM-DD');
      advance.note = values.note;
      this.advancesService.saveAdvance(this.quickData.id || 0, advance).subscribe(
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
      this.notificationService.warn('APP.MESSAGE.warn_save_advance_item', 'APP.TITLE.advance');
    }
  }

  onCloseQuickAdd() {
    this.quickAdd = false;
  }

  onDelete() {
    if (this.currentItem) {
      this.advancesService.deleteAdvance(this.currentItem.id).subscribe(
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
}
