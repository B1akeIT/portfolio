import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { GridUtils } from '@app/utils/grid-utils';
import { LookupService } from '@app/services/lookup.service';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-modal-lookup',
  templateUrl: './modal-lookup.component.html',
  styleUrls: ['./modal-lookup.component.scss']
})
export class ModalLookupComponent implements OnInit, AfterViewInit, AfterViewChecked {

  model: string = '';
  nomeSp: string = '';
  item: any = null;
  clientId: number = null;
  searchTerm = '';

  onClose: Subject<any>;

  elem: ElementRef;
  _H = 0;

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

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

  selectPerPage = APP_CONST.defaultPagination.perPageArr;

  @HostListener('window:resize', ['$event']) onResize() {
    this._styleBodyDialog();
  }

  constructor(
    protected el: ElementRef,
    public bsModalRef: BsModalRef,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private gridUtils: GridUtils,
    private lookupService: LookupService,
  ) {
    this.elem = el;
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();

    this.lookupService.reset();
    this.lookupService.setTenent(tenant);
    this.lookupService.setPage(this.currentPage);
    this.lookupService.setPerPage(this.perPage);

    this.onClose = new Subject();

    this.initGrid(true);
  }

  ngAfterViewInit(): void {
    // this._styleBodyDialog();
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this._styleBodyDialog();
    }, 100);
  }

  _styleBodyDialog() {
    const height = this.elem.nativeElement.clientHeight;
    this._H = height - 56 - 62 - 40 - 40;
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  onSelected(item) {
    this.onClose.next(item);
    this.bsModalRef.hide();
  }

  refresh() {
    this.loadItems();
  }

  initGrid(refresh) {
    this.initAgGrid();

    if (refresh) {
      this.refresh();
    }
  }

  loadItems() {
    this.loading = true;
    this.clearCurrent();
    const _item = {
      AziendaId: this.item.aziendaId,
      TipoDocumentoId: this.item.tipoDocumentoId,
      ContattoIntestatarioId: this.item.contattoIntestatarioId,
      ContattoFatturazioneId: this.item.contattoFatturazioneId,
      ContattoDestinazioneId: this.item.contattoDestinazioneId
    };
    if (this.searchTerm) {
      this.lookupService.setQuery(this.searchTerm);
      this.searchTerm = '';
    }
    this.lookupService.getListCombo(this.nomeSp, _item).subscribe(
      (response: any) => {
        this.items = response.items;
        this.itemsMeta = response.meta;
        if (this.itemsMeta && this.itemsMeta.totalItems) {
          this.numPages = Math.ceil(this.itemsMeta.totalItems / this.perPage);
          const fromCount = (this.currentPage - 1) * this.perPage + 1;
          const toCount = this.isLastPage() ? this.itemsMeta.totalItems : this.currentPage * this.perPage;
          const count = fromCount + ' - ' + toCount;
          this.countTranslateParams = {
            count: count,
            total: this.itemsMeta.totalItems
          };
        } else {
          this.numPages = 0;
          const count = String(this.items.length);
          const total = String(this.items.length);
          this.countTranslateParams = { count: count, total: total };
        }

        this.schema = response.schema.map(elem => {
          const newKey = elem.ColumnName; // _.lowerFirst(elem.ColumnName);
          return newKey;
        });

        this.initAgGrid();

        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = error.message;
      }
    );
  }

  onFilterChanged(event) {
    this.lookupService.setQuery(event);
    this.loadItems();
  }

  isLastPage() {
    if (this.itemsMeta) {
      return (this.currentPage * this.perPage > this.itemsMeta.totalItems);
    }
    return false;
  }

  perPageChanged() {
    this.lookupService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadItems();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.lookupService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadItems();
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

  // Ag-Grid

  initAgGrid() {
    this.agDefaultColumnDefs = {
      autoHeight: false,
      suppressMovable: true,
      sortable: false,
      filter: false,
      editable: false,
      cellStyle: { 'white-space': 'normal' }
    };

    this.agColumnDefs = [];

    this.schema.forEach(obj => {
      const cDef = this.gridUtils.getColumnDefByField(obj);
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
        return data.Id || data.ContattoId;
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
    // this.sideBarStatus = 'inspector';
  }

  onSortChanged(event) {
    const sortState = this.gridApi.getSortModel();
    if (sortState.length === 0) {
      this.lookupService.setSort(this.lookupService.sortDefault.column, this.lookupService.sortDefault.direction);
      // console.log('No sort active');
    } else {
      const item = sortState[0];
      this.lookupService.setSort(item.colId, item.sort);
    }
    this.loadItems();
  }

  onDoubleClicked(params) {
    this.onSelected(this.currentItem);
  }

}
