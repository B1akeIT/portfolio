import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { TranslateService } from '@ngx-translate/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { ResizeEvent } from 'angular-resizable-element';

import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { UsersService } from './users.service';
import { ResizableService } from '@app/services/resizable.service';

import { APP_CONST } from '@app/shared';
import { UserPrincipal, User } from '@app/models/user.model';

import * as _ from 'lodash';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

@Component({
  templateUrl: 'users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  model = 'users';

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  showBarNew = true;
  showBarEdit = true;
  showBarDelete = true;
  showBarPrint = true;
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
  hasSorting = false;
  sort = { column: 'id', direction: 'asc' };
  query = '';

  currentIndex = -1;
  currentId = 0;
  currentElement = null;

  agDefaultColumnDefs = [];
  agAvatarColumn = [];
  agColumnDefs = [];
  agGridOptions = {};

  selectedRows = [];

  gridApi;
  gridColumnApi;

  users = [];
  usersMeta = null;
  currentUser = null;

  userForm: FormGroup;
  userPrincipal: UserPrincipal;
  userPrincipalFields: Array<FormlyFieldConfig>;
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

  countTranslateParams = { count: '', total: '' };

  constructor(
    private translate: TranslateService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private usersService: UsersService,
    public resizable: ResizableService
  ) {
    this.eventsManagerService.on(APP_CONST.userUpdateEvent, (event) => {
      const user = event;
      const index = _.findIndex(this.users, { id: user.id });
      this.setNewData(user.id, user);
    });
  }

  ngOnInit(): void {
    this.usersService.reset();
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
    this.roles = [];

    const roles$ = this.usersService.getListRolePrincipal();

    forkJoin([
      roles$,
    ]).subscribe((results: Array<any>) => {
      this.roles = results[0].items;
    });
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
    this.usersService.setQuery(event);
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    // this.usersService.getJson(this.model)
    this.usersService.getListModel().subscribe(
      (response: any) => {
        this.users = (response.items || []);
        this.usersMeta = response.meta;
        const count = String(this.users.length);
        const total = String(this.users.length);
        this.countTranslateParams = { count: count, total: total };
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
    this.clearCurrent();
    // this.resetPagination();
    this.loadUsers();
    this.sideBarStatus = 'inspector';
  }

  dummyAction(event) {
    console.log('dummyAction', event);
  }

  onSavePrincipal(user) {
    // console.log('onSavePrincipal', user);
    delete user.roles;
    delete user.tenants;

    let saveObs = null;

    if (user.id === 0) {
      saveObs = this.usersService.saveModel(user);
    } else {
      saveObs = this.usersService.updateModel(user.id, user);
    }

    saveObs.subscribe(
      (response: any) => {
        // console.log('saveModel', response);
        this.sideBarStatus = 'inspector';
        if (user.id === 0) {
          this.refresh();
        } else {
          this.setNewData(user.id, user);
        }

        this.notificationService.success('APP.MESSAGE.saved_message', 'APP.TITLE.user');
      },
      (error: any) => {
        this.notificationService.error('APP.MESSAGE.saved_message_error', 'APP.TITLE.user');
        console.log('saveModel error', error);
      }
    );
  }

  onDelete(confirm) {
    if (confirm) {
      this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.users');
      // this.usersService.deleteModel(this.currentId).subscribe(
      //   (response: any) => {
      //     console.log('onDelete', response);
      //     this.refresh();
      //   },
      //   (error: any) => {
      //     console.log('onDelete error', error);
      //     this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.users');
      //   }
      // );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.users');
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
      if (this.panelIsOpen) {
        // load user currentId
        this.currentUser = this.currentElement;
      }
    }
  }

  clearCurrent() {
    this.currentIndex = -1;
    this.currentId = 0;
    this.currentElement = null;
    this.currentUser = null;
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

    this.agDefaultColumnDefs = [
      {
        headerName: this.translate.instant('APP.FIELD.id'),
        field: 'id',
        sortable: true, filter: false,
        minWidth: 70, maxWidth: 70
      },
      {
        headerName: this.translate.instant('APP.FIELD.username'),
        field: 'userName',
        sortable: true, filter: false,
        minWidth: 120,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' }
      },
      {
        headerName: this.translate.instant('APP.FIELD.email'),
        field: 'email',
        sortable: true, filter: false,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' }
      },
      {
        headerName: this.translate.instant('APP.FIELD.active'),
        field: 'isActive',
        sortable: true, filter: false,
        minWidth: 70, maxWidth: 70,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal', 'text-align': 'center' },
        cellRenderer: function (params) {
          const icon = params.data.isActive ? 'checkbox-outline' : 'square-outline';
          return `<ion-icon name="${icon}" class="fa-lg"></ion-icon>`;
        }
      }
    ];

    this.agColumnDefs = this.agDefaultColumnDefs;

    this.agGridOptions = {
      rowSelection: 'single',
      rowMultiSelectWithClick: false,
      localeTextFunc: this.utilsService.localeTextFunc.bind(this),
      getRowNodeId: function (data) {
        return data.id;
      },
      rowClassRules: {
        'item-deactive': function (params) { return !params.data.isActive; }
      },
      navigateToNextCell: this.utilsService.navigateToNextCell.bind(this),
      animateRows: true
    };
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
    this.sideBarStatus = 'inspector';
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

  onEdit(id?) {
    let modifiedFields = [];
    let additionalFields = [];

    this.userForm = new FormGroup({});
    if (this.currentId && (id !== 0)) {
      this.userPrincipal = new UserPrincipal(this.currentElement);
      this.userPrincipal.roleId = this.getRoleId();
      modifiedFields = [
        {
          key: 'roleId',
          type: 'select',
          templateOptions: {
            translate: true,
            label: 'APP.FIELD.role',
            placeholder: 'APP.FIELD.role',
            options: this.roles,
            valueProp: 'name',
            labelProp: 'name',
            disabled: true,
            appearance: 'legacy'
          }
        }
      ];
      additionalFields = [];
    } else {
      this.userPrincipal = new UserPrincipal({});
      modifiedFields = [
        {
          key: 'roleId',
          type: 'select',
          templateOptions: {
            translate: true,
            label: 'APP.FIELD.role',
            placeholder: 'APP.FIELD.role',
            options: this.roles,
            valueProp: 'name',
            labelProp: 'name',
            appearance: 'legacy'
          }
        }
      ];
      additionalFields = [
        {
          validators: {
            'fieldMatch': {
              expression: (control) => {
                const value = control.value;

                return value.ConfirmPassword === value.Password
                  || (!value.ConfirmPassword || !value.Password);
              },
              message: this.translate.stream('APP.FORM.VALIDATION.PASSWORD_NO_MATCHING'),
              errorPath: 'ConfirmPassword',
            },
          },
          fieldGroup: [
            {
              key: 'Password',
              type: 'password',
              templateOptions: {
                type: 'password',
                translate: true,
                label: 'APP.FIELD.password',
                placeholder: 'APP.FIELD.password',
                required: true
              }
            },
            {
              key: 'ConfirmPassword',
              type: 'password',
              templateOptions: {
                type: 'password',
                translate: true,
                label: 'APP.FIELD.confirm_password',
                placeholder: 'APP.FIELD.confirm_password',
                required: true
              }
            }
          ]
        }
      ];
    }

    const replacedItems = this.userPrincipal.formField().map(x => {
      const item = modifiedFields.find(({ key }) => key === x.key);
      return item ? item : x;
    });
    if (this.currentId && (id !== 0)) { replacedItems.pop(); }
    this.userPrincipalFields = [...replacedItems, ...additionalFields];

    this.sideBarStatus = 'edit';
  }

  // Panel

  togglePanel() {
    this.panelIsOpen = !this.panelIsOpen;
    this.currentUser = this.panelIsOpen ? this.currentElement : null;
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
