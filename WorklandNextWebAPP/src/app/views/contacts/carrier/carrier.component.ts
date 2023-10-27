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

import { Carrier } from '@app/models/carrier.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.scss']
})
export class CarrierComponent implements OnInit, OnChanges {

  @Input() contactId = null;
  @Input() readOnly = false;

  aziende = [];

  loading = false;

  data = null;
  originalData = null;
  difference = null;

  currentAzienda = null;

  user = null;
  isAdmin = false;

  selectedIndex = -1;

  modalRef: BsModalRef;

  @ViewChild('editCarrierModal', { static: false }) editCarrierModal;

  dataForm: FormGroup;
  dataModel: any;
  dataFields: Array<FormlyFieldConfig>;

  addCarrier = false;

  loadingOptions = APP_CONST.loadingOptions;

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
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.contactId) {
      this.contactId = changes.contactId.currentValue;
      this.loadData();
    }
  }

  loadData() {
    if (this.contactId !== null) {
      this.loading = true;
      this.contactsService.getContactCarrier(this.contactId).subscribe(
        (resp: any) => {
          this.data = resp;
          this.originalData = resp;
          this.modifiedModel(this.data, this.originalData);
          this.aziende = this.data ? this.data.aziendeList : [];
          if (this.user) {
            this.selectedIndex = _.findIndex(this.aziende, { aziendaId: this.user.aziendaId });
            if (this.selectedIndex !== -1) { this.currentAzienda = this.aziende[this.selectedIndex]; }
          }
          this.loading = false;
        },
        (error: any) => {
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

  // Carrier

  onAddCarrier() {
    // dummy
    this.addCarrier = true;
    this.currentAzienda = {
      aziendaId: this.user.aziendaId,
      azienda: this.translate.instant('APP.TITLE.add_carrier'),
      pathLogo: ''
    };
  }

  onEdit($event, item) {
    this.buildForm(item);
    if (_.isEmpty(item)) {
      const body = {
        contattoId: this.contactId,
        aziendaId: this.user.aziendaId,
        trakingWebSite: '',
        abbonamento: '',
        note: ''
      };
      this.onSave(body);
    }
  }

  buildForm(data) {
    this.dataForm = new FormGroup({});
    this.dataModel = new Carrier(data);
    if (this.dataModel.contattoId === 0) { this.dataModel.contattoId = this.contactId; }
    this.dataFields = this.dataModel.formField();

    const modifiedFields = [];
    const additionalFields = [];
    const replacedItems = this.dataModel.formField().map(x => {
      const item = modifiedFields.find(({ key }) => key === x.key);
      return item ? item : x;
    });
    this.dataFields = [...replacedItems, ...additionalFields];
  }

  onSave(data) {
    // this.loading_saving = true;

    this.contactsService.saveCarrier(data).subscribe(
      (resp: any) => {
        this.data = resp;
        this.originalData = resp;
        this.loadData();
        const title = this.translate.instant('APP.MESSAGE.saved');
        const message = this.translate.instant('APP.MESSAGE.saved_message');
        this.notificationService.success(message, title);
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.success(message, title);
      }
    );
  }

  onCloseEdit(event) {
    if (this.addCarrier) {
      this.currentAzienda = null;
      setTimeout(() => {
        this.loadData();
      }, 200);
    }
    this.addCarrier = false;
  }

  onDeleteCarrier(event) {
    this.contactsService.deleteCarrier(event.id).subscribe(
      (resp: any) => {
        this.notificationService.deleted();
        this.loadData();
      },
      (error: any) => {
        this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.carrier');
        if (error.error && error.error.Message) {
          this.notificationService.error(error.error.Message, 'APP.TITLE.quotes');
        }
      }
    );
  }

  // Utilities

  modifiedModel(obj1, obj2) {
    this.difference = this.utilsService.objectsDiff(obj1, obj2);
    return !_.isEmpty(this.difference);
  }

  isModifiedProperty(property) {
    return (this.difference && this.difference.hasOwnProperty(property));
  }
}
