import { Component, ViewChild, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

import { EventsManagerService } from '@app/services/eventsmanager.service';
import { OptionsService } from '@app/services/options.service';
import { AuthenticationService } from '@app/services/authentication.service';

import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';

import { TablesService } from './tables.service';

import { FilterTextboxComponent } from '@app/components/filter-textbox/filter-textbox.component';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  @ViewChild('filterTextboxComponent', { static: false }) filterTextboxComponent: FilterTextboxComponent;

  modified = false;

  isShowedOptions = true;
  isShowedDevOptions = false;

  agDefaultColumnDefs = null;
  agColumnDefs = [];
  agGridOptions = {};

  selectedRows = [];

  gridApi;
  gridColumnApi;

  tables = [];
  tablesGroups = [];
  table = null;
  data = [];

  tenant = null;
  companies = [];
  currentCompany = null;

  loading_tables = false;
  loading_data = false;
  loadingOptions = APP_CONST.loadingOptions;

  currentIndex = -1;
  currentId = 0;
  currentElement = null;

  error = false;
  errorMessage = '';

  status = 'view';

  countTranslateParams = { count: '', total: '' };

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  constructor(
    private translate: TranslateService,
    private eventsManagerService: EventsManagerService,
    private optionsService: OptionsService,
    private auth: AuthenticationService,
    private utilsService: UtilsService,
    private gridUtils: GridUtils,
    private tablesService: TablesService
  ) {
    this.tenant = this.auth.getCurrentTenant();

    this.editorOptions = new JsonEditorOptions();
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.editorOptions.mode = 'view'; // set only one mode

    this.eventsManagerService.on(APP_CONST.tableUpdateEvent, (event) => {
      const data = event;
      const index = _.findIndex(this.data, { id: data.id });
      if (index !== -1) {
        this.setNewData(data.id, data);
      } else {
        this.loadTable();
      }
    });
  }

  ngOnInit(): void {
    const tenant = this.auth.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);

    this.loadCompanies();

    this.loadTables();
    this.initGrid(true);
  }

  refresh() {
    this.clearCurrent();
    // this.resetPagination();
    // this.loadDataTables();
  }

  loadTables() {
    this.loading_tables = true;
    this.tablesService.getTables().subscribe(
      (resp: any) => {
        this.tables = resp.data;
        const groups = _.groupBy(this.tables, 'group');
        const keys = _.keys(groups);
        this.tablesGroups = [];
        keys.forEach(key => {
          if (groups[key][0].show) {
            this.tablesGroups.push({
              group: groups[key][0].group,
              groupId: key,
              groupSort: groups[key][0].groupSort,
              items: groups[key]
            });
          }
        });
        this.loading_tables = false;
      },
      (error: any) => {
        this.loading_tables = false;
        this.error = true;
        this.errorMessage = error.message;
      }
    );
  }

  loadTable() {
    if (this.table.active && this.needCompany()) {
      this.data = [];
      this.loading_data = true;

      const companyId = this.currentCompany?.id ?? null;

      let paged = true;
      if (this.table.name === 'ShipType') { paged = false; }

      this.tablesService.getTable(this.table.api, companyId, paged).subscribe(
        (resp: any) => {
          // this.data = resp.items;
          this.data = resp.items.map(item => this.gridUtils.renameJson(item));
          const count = String(this.data.length);
          const total = String(this.data.length);
          this.countTranslateParams = { count: count, total: total };
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
      this.clearCurrent(true);
    } else {
      this.table = table;
      this.clearCurrent(true);
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

  clearCurrent(clearCmp = false) {
    this.error = false;
    this.errorMessage = '';
    this.currentIndex = -1;
    this.currentId = 0;
    this.currentElement = null;
    if (clearCmp) {
      this.currentCompany = null;
    }
  }

  loadCompanies() {
    this.tablesService.getAziende().subscribe(
      (resp: any) => {
        this.companies = resp;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  onCompany(event) {
    this.currentCompany = event;
    this.clearCurrent();
    this.loadTable();
  }

  needCompany() {
    if (this.table && this.table.company) {
      return this.currentCompany;
    }
    return true;
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
      case 'Iva':
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
          },
          {
            headerName: this.translate.instant('APP.FIELD.aliquota'),
            field: 'aliquota',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          }
        ];
        break;
      case 'ModalitaPagamento':
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
          },
          {
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          }
        ];
        break;
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
          },
          {
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          }
        ];
        break;
      case 'Nazione':
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
      case 'Ruolo':
        columnDefs = [
          {
            headerName: this.translate.instant('APP.FIELD.id'),
            field: 'id',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.descrizione'),
            field: 'descrizione'
          }
        ];
        break;
      case 'ShipType':
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
      case 'ShipYard':
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
      case 'TipoPagamento':
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
          },
          {
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          }
        ];
        break;
      case 'Abi':
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
      case 'Cab':
        columnDefs = [
          {
            headerName: this.translate.instant('APP.FIELD.id'),
            field: 'id',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.anagAbiId'),
            field: 'anagAbiId',
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
          },
          {
            headerName: this.translate.instant('APP.FIELD.indirizzo'),
            field: 'indirizzo',
            minWidth: 70, maxWidth: 70

          },
          {
            headerName: this.translate.instant('APP.FIELD.comune'),
            field: 'comune',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.cap'),
            field: 'cap',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.provincia'),
            field: 'provincia',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.anagNazioneId'),
            field: 'anagNazioneId',
            minWidth: 70, maxWidth: 70
            //oldId
            //oldAbiId
          }
        ];
        break;
      case 'AspettoEsterioreArticolo':
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
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          }
        ];
        break;
      case 'CategoriaAllegati':
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
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          }
        ];
        break;
      case 'CategoriaMerceologica':
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
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          },
          {
            headerName: this.translate.instant('APP.FIELD.codiceGestionale'),
            field: 'codiceGestionale',
            minWidth: 70, maxWidth: 70
          }
        ];
        break;
      case 'ClassificazioneArticolo':
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
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          },
          {
            headerName: this.translate.instant('APP.FIELD.codiceGestionale'),
            field: 'codiceGestionale',
            minWidth: 70, maxWidth: 70
          }
        ];
        break;
      case 'DescEmail':
        columnDefs = [
          {
            headerName: this.translate.instant('APP.FIELD.id'),
            field: 'id',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.descrizione'),
            field: 'descrizione'
          }
        ];
        break;
      case 'Lingua':
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
          },
          {
            headerName: this.translate.instant('APP.FIELD.culture'),
            field: 'culture',
            minWidth: 70, maxWidth: 70
          }
          //oldId
        ];
        break;
      case 'OrigineContatto':
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
          },
          {
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          }
          //oldId
        ];
        break;
      case 'Porto':
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
      case 'TipoCliente':
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
      case 'TipoProdotto':
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
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          },
          {
            headerName: this.translate.instant('APP.FIELD.codiceGestionale'),
            field: 'codiceGestionale',
            minWidth: 70, maxWidth: 70
          }
        ];
        break;
      case 'UnitaDiMisura':
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
          },
          {
            headerName: this.translate.instant('APP.FIELD.codiceGestionale'),
            field: 'codiceGestionale',
            minWidth: 70, maxWidth: 70
          },
          {
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          }
        ];
        break;
      case 'Valutazione':
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
          },
          {
            headerName: this.translate.instant('APP.FIELD.empty'),
            field: 'isDefault',
            minWidth: 50, maxWidth: 50,
            cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
            cellRenderer: function (params) {
              const icon = params.data.isDefault ? 'checkbox-outline' : 'square-outline';
              return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
            }
          },
          {
            headerName: this.translate.instant('APP.FIELD.colore'),
            field:'colore',
            minWidth: 70, maxWidth: 70
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
      autoHeight: true,
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
      // rowClassRules: {
      //   'item-deactive-': function (params) { return !params.data.isActive; }
      // },
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

  onGridSizeChanged(params) {
    const gridWidth = document.getElementById('grid-wrapper').offsetWidth;
    const columnsToShow = [];
    const columnsToHide = [];
    let totalColsWidth = 0;
    const allColumns = params.columnApi.getAllColumns();
    for (let i = 0; i < allColumns.length; i++) {
      const column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
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
