import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { TablesService } from '@app/views/tables/tables.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { GridUtils } from '@app/utils/grid-utils';
import { ContactsService } from '@app/views/contacts/contacts.service';
import { EmailsGridListService } from './emails-grid-list.service';

// import { ModalEmailEditComponent } from '@app/views/emailsgridlist/modal-email-item/modal-email-item.component';

import { Email } from '@app/models/email.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-emails-grid-list',
  templateUrl: './emails-grid-list.component.html',
  styleUrls: ['./emails-grid-list.component.scss']
})
export class EmailsGridListComponent implements OnInit, OnChanges {

  @Input() contactId = null;
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

  model = 'email';

  loading: boolean = false;
  loading_saving: boolean = false;
  loadingOptions: any = APP_CONST.loadingOptions;
  error: boolean = false;
  errorMessage: string = '';

  user: any = null;

  gridInitialized: boolean = false;
  agDefaultColumnDefs: any = null;
  agColumnDefs: any[] = [];
  agGridOptions: any = {};

  selectedRows: any = [];

  gridApi;
  gridColumnApi;

  gridPinned: boolean = false;

  items: any[] = [];
  schema: any[] = [];
  itemsMeta: any = null;

  currentIndex: number = -1;
  currentId: number = 0;
  currentItem: any = null;

  limit: number = 0;
  perPage: number = 50;
  currentPage: number = 1;

  maxPages: number = 5;
  numPages: number = 0;
  countTranslateParams = { count: '', total: '' };

  quickAdd: boolean = false;
  quickForm: FormGroup = new FormGroup({});
  quickData: any = {};

  anagrafiche: any[] = [];

  @ViewChild('editEmailModal', { static: false }) editEmailModal;

  modalRef: BsModalRef;

  dataForm: FormGroup;
  dataModel: any;
  dataFields: Array<FormlyFieldConfig>;
  optionsForm: FormlyFormOptions;

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    private gridUtils: GridUtils,
    private contactsService: ContactsService,
    private emailsGridListService: EmailsGridListService,
    private fb: FormBuilder
  ) {
    this.user = this.authenticationService.getUserTenant();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contactId) {
      this.contactId = changes.contactId.currentValue;
      this.loadEmailsGridList();
    }
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();
    this.emailsGridListService.reset();
    this.emailsGridListService.setTenent(tenant);

    const tables = [
      'AnagDescEmail'
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    this.emailsGridListService.getGrid('RicercaEmailView').subscribe(
      (response: any) => {
        if (response && response.schemaDescription) {
          const jsonSchema = JSON.parse(response.schemaDescription)[0];
          const columnSchemas = JSON.parse(jsonSchema.ColumnSchemas);
          const visibilityStatus = JSON.parse(jsonSchema.VisibilityStatus);
          let orderColumns = null;
          if (visibilityStatus !== 0) {
            const gridStatus = JSON.parse(jsonSchema.GridStatus);
            orderColumns = gridStatus.columns;
          }
          const filterStatus = JSON.parse(jsonSchema.FilterStatus);

          this.schema = columnSchemas.filter(elem => {
            const visibilityItem = _.findIndex(visibilityStatus, { 'columnName': elem.ColumnName, 'isVisible': true });
            return (true);
            // return (visibilityItem !== -1);
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

  loadEmailsGridList() {
    this.error = false;
    this.errorMessage = '';
    this.clearCurrent();
    if (this.contactId) {
      this.loading = true;
      this.contactsService.getContactEmails(this.contactId, this.aziendaId || 1).subscribe(
        (response: any) => {
          this.items = response.items ? response.items.map(item => this.gridUtils.renameJson(item)) : [];
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    }
  }

  refresh() {
    this.loadEmailsGridList();
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
    this.emailsGridListService.setPerPage(this.perPage);
    this.clearCurrent();
    this.loadEmailsGridList();
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
    this.emailsGridListService.setPage(this.currentPage);
    this.clearCurrent();
    this.loadEmailsGridList();
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
    cDef.hide = true;
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
      this.emailsGridListService.setSort(this.emailsGridListService.sortDefault.column, this.emailsGridListService.sortDefault.direction);
    } else {
      const item = sortState[0];
      this.emailsGridListService.setSort(item.colId, item.sort);
    }
    this.loadEmailsGridList();
  }

  onDoubleClicked(params) {
    if (!this.multiSelection) {
      // this.onQuickModify();
      this.onEdit(this.currentItem);
    }
  }

  setNewData(id, data) {
    if (this.gridApi) {
      const rowNode = this.gridApi.getRowNode(id);
      if (rowNode) { rowNode.setData(data); }
    }
  }

  buildQuickForm(data?: any): void {
    // const _importo = data ? data.importo : null;
    // const _dataPagamento = data ? moment(data.dataPagamento).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    // const _note = data ? data.note : null;
    // this.quickForm = this.fb.group({
    //   importo: new FormControl(_importo, [Validators.required]),
    //   dataPagamento: new FormControl(_dataPagamento, [Validators.required]),
    //   note: new FormControl(_note, [])
    // });
  }

  onQuickAdd() {
    // this.currentItem = null;
    // this.buildQuickForm();
    // this.quickData = new Email({
    //   preventivoTestataId: (this.tipoDocumentoId === 10) ? this.documentoId : null,
    //   ordineClienteTestataId: (this.tipoDocumentoId === 9) ? this.documentoId : null,
    //   clienteContabilitaId: this.clienteContabilitaId
    // });
    // this.quickAdd = true;
  }

  onQuickModify() {
    // this.buildQuickForm(this.currentItem);
    // this.quickData = new Email({ ...this.currentItem });
    // this.quickAdd = true;
  }

  onQuickSave(values: any) {
    // this.quickData.importo = parseFloat(values.importo) || 0;
    // if (this.quickData.importo > 0) {
    //   const email = this.quickData;
    //   email.dataPagamento = moment(values.dataPagamento).format('YYYY-MM-DD');
    //   email.note = values.note;
    //   this.emailsGridListService.saveEmail(this.quickData.id || 0, email).subscribe(
    //     ((response: any) => {
    //       this.items = response.dettagliList;
    //       this.save.emit(response);
    //       this.quickAdd = false;
    //       this.refresh();
    //     }),
    //     (error => {
    //       const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
    //       const message = error.message;
    //       this.notificationService.error(message, title);
    //     })
    //   );
    // } else {
    //   this.notificationService.warn('APP.MESSAGE.warn_save_email_item', 'APP.TITLE.email');
    // }
  }

  onCloseQuickAdd() {
    // this.quickAdd = false;
  }

  onDelete() {
    if (this.currentItem) {
      this.emailsGridListService.deleteModel(this.currentItem.id).subscribe(
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

  onEdit(item) {
    this.buildForm(item);
    this.openModal(this.editEmailModal);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: false,
      // class: 'modal-lg-custom'
    });
  }

  closeModal() {
    this.modalRef.hide();
  }

  buildForm(data) {
    this.dataForm = new FormGroup({});
    this.dataModel = new Email(data);
    if (this.dataModel.contattoId === 0) { this.dataModel.contattoId = this.contactId; }
    if (this.dataModel.aziendaId === 0) { this.dataModel.aziendaId = this.aziendaId || 1; }
    this.dataFields = this.dataModel.formField();

    const modifiedFields = [
      {
        key: 'anagDescEmailId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.anagDescEmailId',
          placeholder: 'APP.FIELD.anagDescEmailId',
          options: this.anagrafiche['AnagDescEmail'],
          valueProp: 'id',
          labelProp: 'descrizione',
          appearance: 'legacy'
        },
      }
    ];
    const additionalFields = [];
    const replacedItems = this.dataModel.formField().map(x => {
      const item = modifiedFields.find(({ key }) => key === x.key);
      return item ? item : x;
    });
    this.dataFields = [...replacedItems, ...additionalFields];
  }

  onSave(data) {
    const isNew = data.id ? false : true;
    this.loading_saving = true;

    this.emailsGridListService.saveModel(data).subscribe(
      (resp: any) => {
        this.dataModel = resp;
        this.loading_saving = false;
        this.notificationService.saved();

        this.refresh();
        this.closeModal();
      },
      (error: any) => {
        this.loading_saving = false;
        this.error = true;
        this.errorMessage = error.message;
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      }
    );
  }
}
