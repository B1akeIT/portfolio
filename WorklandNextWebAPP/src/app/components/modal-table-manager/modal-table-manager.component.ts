import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { FilterTextboxComponent } from '@app/components/filter-textbox/filter-textbox.component';

import { EventsManagerService } from '@app/services/eventsmanager.service';
import { UtilsService } from '@app/services/utils.service';
import { TablesService } from '@app/views/tables/tables.service';
import { AuthenticationService } from '@app/services/authentication.service';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-modal-table-manager',
  templateUrl: './modal-table-manager.component.html',
  styleUrls: ['./modal-table-manager.component.scss']
})
export class ModalTableManagerComponent implements OnInit {

  @ViewChild('filterTextboxComponent', { static: false }) filterTextboxComponent: FilterTextboxComponent;

  table = null;
  tables = null;

  showTableDropdown = false;

  onSave: Subject<any>;
  onClose: Subject<any>;

  data = [];
  loading_data = false;
  loadingOptions = APP_CONST.loadingOptions;

  currentIndex = -1;
  currentId = 0;
  currentElement = null;

  agDefaultColumnDefs = null;
  agColumnDefs = [];
  agGridOptions = {};

  selectedRows = [];

  gridApi;
  gridColumnApi;

  error = false;
  errorMessage = '';

  status = 'view';

  constructor(
    public bsModalRef: BsModalRef,
    private translate: TranslateService,
    private eventsManagerService: EventsManagerService,
    private auth: AuthenticationService,
    private tablesService: TablesService,
    private utilsService: UtilsService
  ) {
    this.eventsManagerService.on(APP_CONST.tableUpdateEvent, (event) => {
      const item = event;
      const index = _.findIndex(this.data, { id: item.id });
      if (index !== -1) {
        this.setNewData(item.id, item);
      } else {
        this.loadTable();
      }
      this.onSave.next({ table: this.table, item: item});
    });
  }

  ngOnInit() {
    this.onSave = new Subject();
    this.onClose = new Subject();

    const tenant = this.auth.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);

    this.loadTable();
    this.initGrid(true);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  onSelected(item) {
    this.onClose.next(item);
    this.bsModalRef.hide();
  }

  refresh() {
    this.clearCurrent();
  }

  loadTable() {
    this.data = [];
    if (this.table) {
      this.loading_data = true;

      const paged = true;

      this.tablesService.getTable(this.table.api, null, paged).subscribe(
        (resp: any) => {
          this.data = resp.items;
          this.loading_data = false;
        },
        (error: any) => {
          this.loading_data = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    }
  }

  setCurrentTable(event, table) {
    if (this.filterTextboxComponent) { this.filterTextboxComponent.clearFilter(event); }
    if (event.altKey) {
      this.table = null;
      this.clearCurrent();
    } else {
      this.table = table;
      this.clearCurrent();
      this.initGrid(true);
      this.loadTable();
    }
  }

  setCurrentItem(i, element) {
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
  }

  // ag-Grid

  initGrid(refresh) {
    this.initAgGrid(this.table ? this.table.model : '');

    if (refresh) {
      this.refresh();
    }
  }

  getGridFields(table) {
    let columnDefs = [];

    switch (table) {
      case 'Valuta':
        columnDefs = [
          {
            headerName: this.translate.instant('APP.FIELD.id'),
            field: 'id',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.descrizione'),
            field: 'descrizione'
          },
          {
            headerName: this.translate.instant('APP.FIELD.symbol'),
            field: 'simbolo',
            minWidth: 50, maxWidth: 50
          }
        ];
        break;

      default:
        columnDefs = [
          {
            headerName: this.translate.instant('APP.FIELD.id'),
            field: 'id',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.codice'),
            field: 'codice',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.descrizione'),
            field: 'descrizione'
          }
        ];
        break;
    }

    return columnDefs;
  }

  initAgGrid(table) {
    const $this = this;

    this.agDefaultColumnDefs = {
      autoHeight: false,
      sortable: true,
      filter: false,
      cellStyle: { 'white-space': 'normal' }
    };

    this.agColumnDefs = this.getGridFields(table);

    this.agGridOptions = {
      rowSelection: 'single',
      rowMultiSelectWithClick: false,
      localeTextFunc: this.utilsService.localeTextFunc.bind(this),
      getRowNodeId: function (data) {
        return data.id;
      },
      navigateToNextCell: this.utilsService.navigateToNextCell.bind(this),
      animateRows: true
    };

    if (this.gridApi) {
      setTimeout(function () {
        $this.gridApi.sizeColumnsToFit();
      });
    }
  }

  onGridReady(params) {
    const $this = this;

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
    this.gridApi.resetRowHeights();

    window.addEventListener('resize', function () {
      setTimeout(function () {
        $this.gridApi.sizeColumnsToFit();
        $this.gridApi.resetRowHeights();
      });
    });
  }

  onSelectionChanged(params) {
    if (this.status === 'edit') { return; }
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
  }

  onDoubleClicked(params) {
    // this.onEdit();
  }

  setNewData(id, data) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(id);
      if (rowNode) { rowNode.setData(data); }
    }
  }

  onStatus(event) {
    this.gridApi.deselectAll();
    this.status = event;
  }

  onFilterChanged(event) {
    this.gridApi.setQuickFilter(event);
    this.clearCurrent();
  }
}
