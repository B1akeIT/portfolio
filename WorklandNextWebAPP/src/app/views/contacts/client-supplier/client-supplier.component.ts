import { Component, Input, OnInit, OnChanges, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { ContactsService } from '../contacts.service';
import { TablesService } from '@app/views/tables/tables.service';
// import { FormManagerService } from '@app/services/form/form-manager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';

import { Client } from '@app/models/client.model';
import { Supplier } from '@app/models/supplier.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-client-supplier',
  templateUrl: './client-supplier.component.html',
  styleUrls: ['./client-supplier.component.scss']
})
export class ClientSupplierComponent implements OnInit, OnChanges {

  @Input() contactId = null;
  @Input() type = null;
  @Input() readOnly = false;

  aziende = [];

  loading = false;

  dataCS = null;
  originalDataCS = null;
  difference = null;

  currentAzienda = null;

  user = null;
  isAdmin = false;
  tenant = '';

  selectedIndex = -1;

  modalRef: BsModalRef;

  @ViewChild('editClientSupplierModal', { static: false }) editClientSupplierModal;

  dataForm: FormGroup;
  dataModel: any;
  dataFields: Array<FormlyFieldConfig>;

  addAccounting = false;

  loadingOptions = APP_CONST.loadingOptions;

  tipiCliente = [];

constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private contactsService: ContactsService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    private utilsService: UtilsService
  ) {
    this.user = this.authenticationService.getUserTenant();
    this.isAdmin = this.authenticationService.isAdmin();
    this.tenant = this.authenticationService.getCurrentTenant();
  }

  ngOnInit(): void {
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.tenant);
    this.tablesService.getTable('AnagTipoCliente').subscribe(
      (resp: any) => {
        this.tipiCliente = resp.items;
      }
    );
  }

  ngOnChanges(changes: any) {
    if (changes.contactId) {
      this.contactId = changes.contactId.currentValue;
    }
    if (changes.type) {
      this.type = changes.type.currentValue;
    }

    this.loadData();
  }

  loadData() {
    if (this.contactId !== null && this.type !== null) {
      this.loading = true;
      this.contactsService.getContactType(this.contactId, this.type).subscribe(
        (resp: any) => {
          this.dataCS = resp;
          this.originalDataCS = resp;
          this.modifiedModel(this.dataCS, this.originalDataCS);
          this.aziende = this.dataCS ? this.dataCS.aziendeContabilitaList : [];
          if (this.user) {
            this.selectedIndex = _.findIndex(this.aziende, { aziendaId: this.user.aziendaId });
            if (this.selectedIndex !== -1) { this.currentAzienda = this.aziende[this.selectedIndex]; }
          }
          this.loading = false;
        }
      );
    }
  }

  setCurrentAzienda(event, item) {
    if (event?.altKey) {
      this.currentAzienda = null;
    } else {
      this.currentAzienda = item;
    }
  }

  onSelectMatTab(event) {
    console.log('onSelectMatTab', event);
    // this.currentAzienda = this.panels[event.index].key;
  }

  onAddAccounting() {
    // dummy
    this.addAccounting = true;
    this.currentAzienda = {
      aziendaId: this.user.aziendaId,
      azienda: this.translate.instant('APP.TITLE.add_accounting_data'),
      pathLogo: ''
    };
  }

  onCloseEdit(event) {
    if (this.addAccounting) {
      this.currentAzienda = null;
      this.loadData();
    }
    this.addAccounting = false;
  }

  onDeleteClientSupplier(event) {
    // console.log('onDeleteClientSupplier', this.type, this.dataCS);
    if (this.isClient()) {
      this.contactsService.deleteClient(this.dataCS.id).subscribe(
        (resp: any) => {
          this.dataCS = null;
          this.originalDataCS = null;
          this.notificationService.deleted();
        },
        (error: any) => {
          const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
          const message = error.message;
          this.notificationService.error(message, title);
        }
      );
    } else {
      this.contactsService.deleteFornitore(this.dataCS.id).subscribe(
        (resp: any) => {
          this.dataCS = null;
          this.originalDataCS = null;
          this.notificationService.deleted();
        },
        (error: any) => {
          const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
          const message = error.message;
          this.notificationService.error(message, title);
        }
      );
    }
  }

  onDeleteAccounting(event) {
    console.log('onDeleteAccounting', this.type, event);
  }

  // Client - Supplier

  onEdit($event, item) {
    this.buildForm(item);
    if (this.isClient()) {
      this.openModal(this.editClientSupplierModal);
    } else {
      if (_.isEmpty(item)) {
        const body = {
          contattoId: this.contactId
        };
        this.onSave(body);
      }
    }
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
    if (this.isClient()) {
      this.dataModel = new Client(data);
      this.originalDataCS = this.dataModel;
    } else {
      this.dataModel = new Supplier(data);
    }
    if (this.dataModel.contattoId === 0) { this.dataModel.contattoId = this.contactId; }
    this.dataFields = this.dataModel.formField();

    const modifiedFields = [
      {
        key: 'anagTipoClienteId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.tipoCliente',
          placeholder: 'APP.FIELD.tipoCliente',
          options: this.tipiCliente,
          valueProp: 'id',
          labelProp: 'descrizione',
          appearance: 'legacy'
        }
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
    // this.loading_saving = true;

    let saveObs = null;
    if (this.isClient()) {
      // set data blocco
      this.modifiedModel(data, this.originalDataCS);
      if (this.isModifiedProperty('isBloccato')) {
        data.aziendaBloccoId = data.isBloccato ? this.user.aziendaId : null;
        data.dataBlocco = data.isBloccato ? moment().format('yyyy-MM-DD') : null;
      }

      saveObs = this.contactsService.saveClient(data);
    } else {
      saveObs = this.contactsService.saveFornitore(data);
    }

    saveObs.subscribe(
      (resp: any) => {
        this.dataCS = resp;
        this.originalDataCS = resp;
        this.notificationService.saved();
        if (this.isClient()) { this.closeModal(); }
      },
      (error: any) => {
        // this.loading_saving = false;
        // this.error = true;
        // this.errorMessage = error.message;
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      }
    );
  }

  // Utilities

  isClient() {
    return ((this.type === 'Cliente') || (this.type === 'client'));
  }

  isSupplier() {
    return ((this.type === 'Fornitore') || (this.type === 'supplier'));
  }

  modifiedModel(obj1, obj2) {
    this.difference = this.utilsService.objectsDiff(obj1, obj2);
    return !_.isEmpty(this.difference);
  }

  isModifiedProperty(property) {
    return (this.difference && this.difference.hasOwnProperty(property));
  }
}
