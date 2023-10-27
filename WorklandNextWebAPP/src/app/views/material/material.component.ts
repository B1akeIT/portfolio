import { Component, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { TranslateService } from '@ngx-translate/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { UtilsService } from '@app/services/utils.service';
import { ContactsService } from './contacts.service';

import { APP_CONST } from '@app/shared';

@Component({
  templateUrl: 'material.component.html'
})
export class MaterialComponent implements OnInit {

  model = 'contacts';

  view = 'list';

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;

  showSidebar = true;
  showInspector = true;
  showSearch = false;
  showBoxFilter = false;
  showBoxSorting = false;
  sideBarStatus = 'inspector';

  panelIsOpen = false;

  hasFilter = false;
  filterData = '';
  hasSorting = false;
  sort = { column: 'id', direction: 'asc' };
  query = '';

  currentIndex = -1;
  currentId = 0;
  currentElement = null;

  columnDefs = [];
  agDefaultColumnDefs = [];
  agAvatarColumn = [];
  agColumnDefs = [];
  agGridOptions = {};

  selectedRows = [];

  gridApi;
  gridColumnApi;

  contacts = [];
  contactsMeta = null;
  contact = null;

  radioModel: string = 'Month';

  // Formly Start
  orderForm = new FormGroup({});
  // our model:
  order = {
    tagName: '',
    color: 'powder-blue', // will default to this value
    quantity: 1,
    size: 'M',
    terms: false
  };
  // our field configuration. Keys should match our model:
  orderFields: FormlyFieldConfig[] = [
    {
      key: 'tagName',
      type: 'input', // input type
      templateOptions: {
        type: 'text',
        translate: true,
        label: 'APP.FIELD.address',
        placeholder: 'APP.FIELD.address'
      },
      validation: {
        messages: {
          maxLength: 'Tag name is too long'
        }
      },
      validators: {
        // limit to 25 characters
        maxLength: ({ value }) => {
          return value.length <= 25;
        }
      }
    },
    {
      key: 'color',
      type: 'select',
      templateOptions: {
        label: 'Outfit color',
        options: [
          { label: 'Powder blue', value: 'powder-blue' },
          { label: 'Orange crush', value: 'orange-crush' },
          { label: 'Purple haze', value: 'purple-haze' }
        ]
      }
    },
    {
      key: 'quantity',
      type: 'input',
      templateOptions: {
        type: 'number',
        label: 'How many outfits?',
        placeholder: 'quantity',
        required: true
      }
    },
    {
      key: 'size',
      type: 'select',
      defaultValue: 'M',
      templateOptions: {
        label: 'Size',
        options: [
          { label: 'Small', value: 'S' },
          { label: 'Medium', value: 'M' },
          { label: 'Large', value: 'L' }
        ]
      }
    },
    {
      key: 'terms',
      type: 'checkbox',
      templateOptions: {
        label: 'You accept our terms and conditions',
        required: true
      }
    }
  ];
  // Formly END

  options: AnimationOptions = {
    path: '/assets/animations/teamwork-gears.json',
    loop: false,
    autoplay: true
  };

  constructor(
    private translate: TranslateService,
    private utilsService: UtilsService,
    private contactsService: ContactsService
  ) { }

  ngOnInit(): void {
    this.contactsService.reset();
    this.initGrid(true);
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  toggleInspectorSidebar($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.showInspector = !this.showInspector;
  }

  onFilterChanged(event) {
    console.log('onFilterChanged', event);
  }

  setView(view) {
    this.view = view;
  }

  loadContacts() {
    this.loading = true;
    this.contactsService.getJson(this.model)
      .subscribe(result => {
        this.contacts = result.data;
        this.loading = false;
      });
  }

  refresh() {
    console.log('refresh');
    // this.resetPagination();
    this.loadContacts();
  }

  dummyAction(event) {
    console.log('dummyAction', event);
  }

  onSubmit(order) {
    console.log('onSubmit', order);
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
      if (this.panelIsOpen) {
        // load contact currentId
        this.contact = this.currentElement;
      }
    }
  }

  clearCurrent() {
    this.currentIndex = -1;
    this.currentId = 0;
    this.currentElement = null;
    this.contact = null;
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

    this.agAvatarColumn = [
      {
        headerName: this.translate.instant('APP.FIELD.avatar'),
        field: 'avatar',
        sortable: false, filter: false,
        minWidth: 80, maxWidth: 80,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' },
        // cellRenderer: function (params) {
        //   const imgClass = '';
        //   // const avatarUrl = './assets/img/asset.gif';
        //   const avatar = $this.utilsService.getMainAvatar(params.data);
        //   const avatarUrl = $this.utilsService.getMediumImage(avatar, 'crop', 'avatar');

        //   const classDiv = 'd-flex flex-column justify-content-center align-items-center h-100 img-avatar bg-white border';
        //   const style = 'height: 60px !important;width: 60px !important;overflow: hidden;margin-bottom: 1px;';
        //   let result = '<div class="' + classDiv + '" style="' + style + '">';
        //   result += '<img class="' + imgClass + '" src =\'' + avatarUrl + '\' style="width: 60px; height: auto;"></img></div>';

        //   return result;
        // }
      }
    ];

    this.agDefaultColumnDefs = [
      {
        headerName: this.translate.instant('APP.FIELD.id'),
        field: 'id',
        sortable: false, filter: false,
        minWidth: 70, maxWidth: 70,
        // cellRenderer: function (params) {
        //   let spanDiv = '';
        //   if ($this.isInSelected(params.data)) {
        //     spanDiv += 'badge badge-light-primary';
        //   } else {
        //     spanDiv += 'badge badge-light';
        //   }
        //   const result = '<span class="' + spanDiv + '">' + params.value + '</span>';

        //   return result;
        // }
      },
      {
        headerName: this.translate.instant('APP.FIELD.firstname'),
        field: 'firstname',
        sortable: false, filter: false,
        minWidth: 120,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' }
      },
      {
        headerName: this.translate.instant('APP.FIELD.lastname'),
        field: 'lastname',
        sortable: false, filter: false,
        minWidth: 120,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' }
      },
      {
        headerName: this.translate.instant('APP.FIELD.company'),
        field: 'companyname',
        sortable: false, filter: false,
        minWidth: 120,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' }
      },
      {
        headerName: this.translate.instant('APP.FIELD.qualification'),
        field: 'q_meta.qualification',
        sortable: false, filter: false,
        minWidth: 100,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' },
        cellRenderer: function (params) {
          const spanClass = 'badge badge-light text-uppercase';
          const result = '<span class="' + spanClass + '">' + params.value + '</span>';
          return params.value ? result : '';
        }
      },
      {
        headerName: this.translate.instant('APP.FIELD.address'),
        field: 'address',
        sortable: false, filter: false,
        minWidth: 110,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' },
        // cellRenderer: function (params) {
        //   // const result = $this.utilsService.getMainAddressHtml(params.data.q_main);
        //   const address = $this.utilsService.getMainAddress(params.data.q_main);
        //   return (address) ? address.q_meta.address : '';
        // }
      },
      {
        headerName: this.translate.instant('APP.FIELD.city'),
        field: 'city',
        sortable: false, filter: false,
        minWidth: 80,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' },
        // cellRenderer: function (params) {
        //   const address = $this.utilsService.getMainAddress(params.data.q_main);
        //   return (address) ? address.q_meta.city : '';
        // }
      },
      {
        headerName: this.translate.instant('APP.FIELD.zip'),
        field: 'zip',
        sortable: false, filter: false,
        minWidth: 50,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' },
        // cellRenderer: function (params) {
        //   const address = $this.utilsService.getMainAddress(params.data.q_main);
        //   return (address) ? address.q_meta.zip : '';
        // }
      },
      {
        headerName: this.translate.instant('APP.FIELD.province_r'),
        field: 'province',
        sortable: false, filter: false,
        minWidth: 40,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' },
        // cellRenderer: function (params) {
        //   const address = $this.utilsService.getMainAddress(params.data.q_main);
        //   return (address) ? address.q_meta.province : '';
        // }
      },
      {
        headerName: this.translate.instant('APP.FIELD.state'),
        field: 'state',
        sortable: false, filter: false,
        minWidth: 60,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' },
        // cellRenderer: function (params) {
        //   const address = $this.utilsService.getMainAddress(params.data.q_main);
        //   return (address) ? address.q_meta.state : '';
        // }
      },
      // {
      //   headerName: this.translate.instant('APP.FIELD.created_at'),
      //   field: 'created_at',
      //   sortable: true, minWidth: 50
      // },
      // {
      //   headerName: this.translate.instant('APP.FIELD.updated_at'),
      //   field: 'updated_at',
      //   sortable: true, minWidth: 50
      // }
    ];

    // this.agColumnDefs = this.showAvatar ? this.agAvatarColumn.concat(this.agDefaultColumnDefs) : this.agDefaultColumnDefs;
    this.agColumnDefs = this.agDefaultColumnDefs;

    this.agGridOptions = {
      localeTextFunc: this.utilsService.localeTextFunc.bind(this),
      // getRowHeight: function (params) {
      //   if ($this.showAvatar) {
      //     return 60;
      //   } else {
      //     return 30;
      //   }
      // }
      getRowNodeId: function (data) {
        return data.id;
      },
      getRowClass: function (params) {
        // if ($this.isInProjectSelection(params.data)) {
        //   return 'bg-light-primary';
        // }
      },
      navigateToNextCell: this.utilsService.navigateToNextCell.bind(this)
    };
  }

  onGridReady(params) {
    const $this = this;

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.utilsService.setGrdiApi(this.gridApi);

    // this.gridColumnApi.setColumnVisible('avatar', this.showAvatar);
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
    if (!this.panelIsOpen) {
      params.api.sizeColumnsToFit();
      params.api.resetRowHeights();
    }
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
  }

  onDoubleClicked(params) {
    // this.togglePanel();
  }

  setNewData(id, data) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(id);
      if (rowNode) { rowNode.setData(data); }
    }
  }

  onGroupSorting($event) {
    this.sort.column = $event.column;
    this.sort.direction = $event.direction;
    this.contactsService.setSort($event.field, $event.direction);
    this.hasSorting = ($event.field && $event.field !== '');
    this.refresh();
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

  onGroupFilters($event) {
    let filter = '';
    Object.keys($event).forEach(
      key => {
        filter += filter ? ';' : '';
        switch (key) {
          case 'is_company':
            filter += key + ':' + ($event[key] ? '1' : '0');
            break;
          case 'qualification':
            filter += 'q_meta->' + key + ':' + $event[key];
            break;
          default:
            filter += key + ':' + $event[key];
        }
      }
    );
    this.contactsService.setFilterSearch(filter);
    this.hasFilter = (filter !== '');
    this.filterData = filter;
    this.refresh();
  }

  // Panel

  togglePanel() {
    this.panelIsOpen = !this.panelIsOpen;
    this.contact = this.panelIsOpen ? this.currentElement : null;
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

}
