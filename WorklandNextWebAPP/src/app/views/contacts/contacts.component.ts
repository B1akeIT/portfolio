import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DialogService } from 'ngx-bootstrap-modal';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { ResizeEvent } from 'angular-resizable-element';

import { AuthenticationService } from '@app/services/authentication.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';
import { ContactsService } from './contacts.service';
import { ResizableService } from '@app/services/resizable.service';

import { APP_CONST } from '@app/shared';
import { Contact } from '@app/models/contact.model';

import * as _ from 'lodash';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

@Component({
  templateUrl: 'contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  model = 'contacts';

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  user = null;

  showBarNew = true;
  showBarEdit = true;
  showBarDelete = true;
  showBarPrint = true;
  showBarFilter = true;
  showBarSearch = true;
  showBarRefreah = true;

  showSidebar = true;
  showInspector = true;
  showSearch = false;
  showBoxFilter = false;
  sideBarStatus = 'inspector';

  panelIsOpen = false;

  hasFilter = false;
  filterData = '';
  hasSorting = true;
  sort = { column: 'ragioneSociale', direction: 'asc' };
  query = '';

  sortingFields = [
    'id',
    'nome',
    'cognome',
    'ragioneSociale',
    'pIva',
    'indirizzo',
    'comune',
    'cap'
  ];

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

  contacts = [];
  contactsMeta = null;
  currentContact = null;

  contactForm: FormGroup;
  contact: Contact;
  contactFields: Array<FormlyFieldConfig>;
  optionsForm: FormlyFormOptions;

  options: AnimationOptions = {
    path: '/assets/animations/teamwork-gears.json',
    loop: false,
    autoplay: true
  };

  @ViewChild('sidebarInspector') public sidebarInspectorRef: ElementRef;
  startWidth = 0;
  dragging = false;

  roles = [];

  fxlayoutConfig = {
    header: true,
    leftSidebar: false,
    rightSidebar: true,
    footer: true
  };

  contactType = APP_CONST.contactType;

  filterType = {
    clients: false,
    suppliers: false,
    boats: false,
    // agents: false,
    carriers: false
  };

  modalPrintRef: BsModalRef;

  limit = 0;
  perPage = 50;
  currentPage = 1;

  maxPages = 5;
  numPages = 0;
  countTranslateParams = { count: '', total: '' };

  selectPerPage = APP_CONST.defaultPagination.perPageArr;

  rowModelType = 'serverSide';
  serverSideStoreType = 'partial';

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private gridUtils: GridUtils,
    private contactsService: ContactsService,
    public resizable: ResizableService
  ) {
    this.eventsManagerService.on(APP_CONST.contactUpdateEvent, (event) => {
      const contact = event;
      const index = _.findIndex(this.contacts, { id: contact.id });
      this.setNewData(contact.id, contact);
    });
  }

  ngOnInit(): void {
    const tenant = this.authenticationService.getCurrentTenant();

    this.contactsService.reset();
    this.contactsService.setTenent(tenant);
    this.contactsService.setContactType('');
    this.initData();
    this.initGrid(true);

    // Init Resizable Service
    // this.resizable.setElementRef(this.sidebarInspectorRef);
  }

  fxLayoutBodyHeight() {
    const hf = (this.fxlayoutConfig.header ? 40 : 0) + (this.fxlayoutConfig.footer ? 40 : 0);
    return `calc( 100% - ${hf}px )`;
  }

  initData() {
    // Init Data
    this.user = this.authenticationService.getUserTenant();
  }

  onResizeStart(event): void {
    this.dragging = true;
    const width = window.getComputedStyle(this.sidebarInspectorRef.nativeElement, null).getPropertyValue('width');
    this.startWidth = parseInt(width, 10);
  }

  onResizing(event): void {
    if (this.sidebarInspectorRef) {
      let newWidth = event.rectangle.width;
      if (newWidth < 250) { newWidth = 250; }
      if (newWidth > 800) { newWidth = 800; }
      this.sidebarInspectorRef.nativeElement.style.width = newWidth + 'px';
    }
  }

  onResizeEnd(event: ResizeEvent): void {
    // if (this.validate() && this.sidebarInspectorRef) {
    //   const width = window.getComputedStyle(this.sidebarInspectorRef.nativeElement, null).getPropertyValue('width');
    //   const left: any = event.edges.left;
    //   const newWidth = (this.startWidth - left);
    //   this.sidebarInspectorRef.nativeElement.style.width = newWidth + 'px';
    // }
    this.dragging = false;
  }

  validate(event: ResizeEvent): boolean {
    return true;
  }

  onResizeStop(event): void {
    console.log('Element was resized', event);
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  toggleInspectorSidebar($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.showInspector = !this.showInspector;
  }

  onFilterChanged(event) {
    // console.log('onFilterChanged', event);
    this.contactsService.setQuery(event);
    this.loadContacts();
  }

  loadContacts() {
    this.loading = true;
    // this.contactsService.getJson(this.model)
    this.contactsService.getListModel().subscribe(
      (response: any) => {
        this.contacts = (response.items || []).map(item => this.gridUtils.renameJson(item));
        this.contactsMeta = response.meta;
        if (this.contactsMeta && this.contactsMeta.totalItems) {
          this.numPages = Math.ceil(this.contactsMeta.totalItems / this.perPage);
          const fromCount = (this.currentPage - 1) * this.perPage + 1;
          const toCount = this.isLastPage() ? this.contactsMeta.totalItems : this.currentPage * this.perPage;
          const count = fromCount + ' - ' + toCount;
          this.countTranslateParams = {
            count: count,
            total: this.contactsMeta.totalItems
          };
        } else {
          this.numPages = 0;
          const count = String(this.contacts.length);
          const total = String(this.contacts.length);
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
    this.loadContacts();
  }

  hasFilerType() {
    return (
      this.filterType.clients ||
      this.filterType.suppliers ||
      this.filterType.boats ||
      // this.filterType.agents ||
      this.filterType.carriers);
  }

  clearFilerType() {
    setTimeout(() => {
      this.filterType = {
        clients: false,
        suppliers: false,
        boats: false,
        // agents: false,
        carriers: false
      };
    }, 200);
    this.contactsService.setContactType('');
    this.refresh();
  }

  setFilterType(event) {
    let type = '';

    if (
      this.filterType.clients &&
      this.filterType.suppliers &&
      this.filterType.boats &&
      // this.filterType.agents &&
      this.filterType.carriers) {
      this.clearFilerType();
    } else {
      if (this.filterType.clients) { type += (type !== '') ? ';Cliente' : 'Cliente'; }
      if (this.filterType.suppliers) { type += (type !== '') ? ';Fornitore' : 'Fornitore'; }
      if (this.filterType.boats) { type += (type !== '') ? ';Unita' : 'Unita'; }
      // if (this.filterType.agents) { type += 'Agente'; }
      if (this.filterType.carriers) { type += (type !== '') ? ';Vettore' : 'Vettore'; }

      this.contactsService.setContactType(type);
      this.refresh();
    }
  }

  dummyAction(event) {
    console.log('dummyAction', event);
  }

  onSave(event) {
    if (event.isNew) { this.loadContacts(); }
  }

  onDelete(confirm) {
    if (confirm) {
      this.contactsService.deleteModel(this.currentId).subscribe(
        (response: any) => {
          this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.contacts');
          this.refresh();
        },
        (error: any) => {
          console.log('onDelete error', error);
          this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.contacts');
        }
      );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.contacts');
    }
  }

  setCurrent(i, element) {
    if (!element || this.currentId === element.id) {
      this.clearCurrent();
      if (this.panelIsOpen) {
        // this.togglePanel();
      }
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
    this.currentContact = null;
  }

  isOwner() {
    return (this.user?.aziendaId === this.currentElement?.aziendaInserimentoId);
  }

  resetPagination() {
    this.limit = APP_CONST.defaultPagination.limit;
    // this.perPage = APP_CONST.defaultPagination.perPage;
    this.maxPages = APP_CONST.defaultPagination.maxPages;
    this.currentPage = 1;
    this.contactsService.setLimit(this.limit);
    this.contactsService.setPerPage(this.perPage);
    this.contactsService.setPage(this.currentPage);
    this.contactsService.setFilterSearch(this.filterData);
    this.contactsService.setFilterQuery(this.query);
    this.contactsService.setSort(this.sort.column, this.sort.direction);
    this.clearCurrent();
  }

  isLastPage() {
    if (this.contactsMeta) {
      return (this.currentPage * this.perPage > this.contactsMeta.totalItems);
    }
    return false;
  }

  perPageChanged() {
    this.contactsService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadContacts();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.contactsService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadContacts();
  }

  // ag-Grid

  initGrid(refresh) {
    this.initAgGrid();

    if (refresh) {
      this.refresh();
    }
  }

  initAgGrid() {
    const $this = this;

    this.agDefaultColumnDefs = {
      autoHeight: false,
      sortable: false,
      filter: false,
      cellStyle: { 'white-space': 'normal' }
    };
    this.agColumnDefs = [
      {
        headerName: this.translate.instant('APP.FIELD.id'),
        field: 'id',
        minWidth: 70, maxWidth: 70,
      },
      {
        headerName: this.translate.instant('APP.FIELD.empty'),
        field: 'specializzazioneContattoType',
        sortable: false,
        minWidth: 90, maxWidth: 90,
        cellClass: 'px-0',
        cellRenderer: function (params) {
          const classDiv = 'text-center';
          const style = '';
          const data = params.value;
          let result = '<div class="' + classDiv + '" style="' + style + '">';
          APP_CONST.contactType.forEach((item: any) => {
            const icon = $this.utilsService.hasValueString(data, item.name) ? $this.utilsService.getContactTypeIcon(item.name) : '<i class="cui-minus"></i>';
            result += '<span class="px-1 py-1-">' + icon + '</span>';
          });
          result += '</div>';

          return result;
        }
      },
      {
        headerName: this.translate.instant('APP.FIELD.companyname'),
        field: 'ragioneSociale',
        minWidth: 120
      },
      {
        headerName: this.translate.instant('APP.FIELD.ownerOrYacht'),
        field: 'ownerOrYacht',
        minWidth: 120
      },
      {
        headerName: this.translate.instant('APP.FIELD.firstname'),
        field: 'nome',
        minWidth: 120
      },
      {
        headerName: this.translate.instant('APP.FIELD.lastname'),
        field: 'cognome',
        minWidth: 120
      },
      {
        headerName: this.translate.instant('APP.FIELD.vat'),
        field: 'pIva'
      },
      {
        headerName: this.translate.instant('APP.FIELD.fiscal-code'),
        field: 'codiceFiscale'
      },
      {
        headerName: this.translate.instant('APP.FIELD.address'),
        field: 'indirizzoSede'
      },
      {
        headerName: this.translate.instant('APP.FIELD.city'),
        field: 'comuneSede'
      },
      {
        headerName: this.translate.instant('APP.FIELD.zip'),
        field: 'capSede'
      },
      {
        headerName: this.translate.instant('APP.FIELD.province_r'),
        field: 'provinciaSede'
      },
      {
        headerName: this.translate.instant('APP.FIELD.nation'),
        field: 'anagNazioneId'
      },
      {
        headerName: this.translate.instant('APP.FIELD.email'),
        field: 'email'
      },
      {
        headerName: this.translate.instant('APP.FIELD.pec'),
        field: 'pec'
      }
    ];

    this.agGridOptions = {
      rowSelection: 'single',
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
    // const gridWidth = document.getElementById('grid-wrapper').offsetWidth;
    // const columnsToShow = [];
    // const columnsToHide = [];
    // let totalColsWidth = 0;
    // const allColumns = params.columnApi.getAllColumns();
    // for (let i = 0; i < allColumns.length; i++) {
    //   const column = allColumns[i];
    //   totalColsWidth += column.getMinWidth();
    //   if (totalColsWidth > gridWidth) {
    //     columnsToHide.push(column.colId);
    //   } else {
    //     columnsToShow.push(column.colId);
    //   }
    // }
    // params.columnApi.setColumnsVisible(columnsToShow, true);
    // params.columnApi.setColumnsVisible(columnsToHide, false);
    // if (!this.panelIsOpen) {
    //   // params.api.sizeColumnsToFit();
    //   params.api.resetRowHeights();
    // }
  }

  onSelectionChanged(params) {
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
    // this.sideBarStatus = 'inspector';
  }

  onSortChanged(event) {
    console.log('onSortChanged', event);
    const sortState = this.gridApi.getSortModel();
    if (sortState.length === 0) {
      this.contactsService.setSort(this.contactsService.sortDefault.column, this.contactsService.sortDefault.direction);
      console.log('No sort active');
    } else {
      const item = sortState[0];
      this.contactsService.setSort(item.colId, item.sort);
      console.log('State of sorting is:', item);
      // for (let i = 0; i < sortState.length; i++) {
      //   const item = sortState[i];
      //   console.log(i + ' = {colId: ' + item.colId + ', sort: ' + item.sort + '}');
      // }
    }
    this.loadContacts();
  }

  onDoubleClicked(params) {
    // this.togglePanel();
    this.onEdit();
  }

  setNewData(id, data) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(id);
      if (rowNode) { rowNode.setData(data); }
    }
  }

  getRoleId() {
    const roleName = this.currentElement.roles.length > 0 ? this.currentElement.roles[0] : '';
    const index = _.findIndex(this.roles, { name: roleName });
    return ( index !== -1 ) ? this.roles[index].id : 0;
  }

  onEdit(isNew = false) {
    if (isNew) {
      this.clearCurrent();
    }

    this.togglePanel();
  }

  setPinned() {
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'id',
          pinned: 'left',
        },
        {
          colId: 'tipoContattoList',
          pinned: 'left',
        },
        {
          colId: 'ragioneSociale',
          pinned: 'left',
        }
      ],
      defaultState: { pinned: null },
    });
  }

  clearPinned() {
    this.gridColumnApi.applyColumnState({ defaultState: { pinned: null } });
  }

  togglePinned() {
    this.gridPinned = !this.gridPinned;
    (this.gridPinned) ? this.setPinned() : this.clearPinned();
  }

  // Panel

  togglePanel() {
    this.panelIsOpen = !this.panelIsOpen;
    this.currentContact = this.panelIsOpen ? this.currentElement : null;
  }

  closePanel() {
    this.panelIsOpen = false;

    // this.eventsManagerService.broadcast(APP_CONST.closeFloatPanelEvent, true);
  }

  onClosePanel(event) {
    this.closePanel();
    // refresh selected element
    // this.saveStatus = null;
  }

  clearFilterSort() {
    const oneEmit = this.hasFilter || this.hasSorting;
    if (oneEmit) {
      this.filterData = '';
      this.hasFilter = false;
      this.hasSorting = false;
      this.sort = { column: 'id', direction: 'asc' };
      // this.contactsSortingComponent.clearSorting(false);
      // this.contactsFilterComponent.clearFilter(true);
    }
  }

  onGroupSorting($event) {
    this.sort.column = $event.column;
    this.sort.direction = $event.direction;
    this.contactsService.setSort($event.field, $event.direction);
    this.hasSorting = ($event.field && $event.field !== '');
    this.refresh();
  }

  isSortAsc() {
    return (this.sort.direction === 'asc');
  }

  onGroupFilters($event) {
    let filter = '';
    // Object.keys($event).forEach(
    //   key => {
    //     filter += filter ? ';' : '';
    //     switch (key) {
    //       case 'is_company':
    //         filter += key + ':' + ($event[key] ? '1' : '0');
    //         break;
    //       case 'qualification':
    //         filter += 'q_meta->' + key + ':' + $event[key];
    //         break;
    //       default:
    //         filter += key + ':' + $event[key];
    //     }
    //   }
    // );
    // this.contactsService.setFilterSearch(filter);
    this.hasFilter = (filter !== '');
    this.filterData = filter;
    this.refresh();
  }

  // Print

  openPrintModal($event) {
    $event.preventDefault();
    $event.stopPropagation();

    // const initialState = {
    //   model: 'contact'
    // };
    // this.modalPrintRef = this.modalService.show(PrintComponent, {
    //   ignoreBackdropClick: true,
    //   class: 'modal-lg',
    //   initialState: initialState
    // });
  }

  // Utilities

  removeYesNo() {
    const title = this.translate.instant('APP.TITLE.delete');
    const message = this.translate.instant('APP.MESSAGE.are_you_sure');
    const cancelText = this.translate.instant('APP.BUTTON.cancel');
    const confirmText = this.translate.instant('APP.BUTTON.confirm');

    return this.dialogService.confirm(title, message, {
      cancelButtonText: cancelText,
      cancelButtonClass: 'btn-light btn-sm',
      confirmButtonText: confirmText,
      confirmButtonClass: 'btn-danger btn-sm',
      backdrop: 'static'
    });
  }

  onNextElement($event) {
    console.log('onNextElement', $event);
  }

  onPrevElement($event) {
    console.log('onPrevElement', $event);
  }
}
