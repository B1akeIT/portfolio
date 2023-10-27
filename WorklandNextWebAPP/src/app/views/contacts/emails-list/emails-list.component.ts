import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ContactsService } from '@app/views/contacts/contacts.service';
import { EmailsService } from './emails.service';

import { Email } from '@app/models/email.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-emails-list',
  templateUrl: './emails-list.component.html',
  styleUrls: ['./emails-list.component.scss']
})
export class EmailsListComponent implements OnInit, OnChanges {

  @Input() contactId = null;
  @Input() aziendaId = null;
  @Input() showListAction = false;
  @Input() small = false;
  @Input() onlyRead = false;

  items = [];

  loading = false;
  loading_saving = false;
  loadingOptions = APP_CONST.loadingOptions;

  error = false;
  errorMessage = '';

  currentItem = null;

  user = null;

  selectedIndex = -1;

  edit = false;

  excluded = APP_CONST.fieldExcluded;

  @ViewChild('editEmailModal', { static: false }) editEmailModal;

  modalRef: BsModalRef;

  dataForm: FormGroup;
  dataModel: any;
  dataFields: Array<FormlyFieldConfig>;
  optionsForm: FormlyFormOptions;

  anagrafiche = [];

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private gridUtils: GridUtils,
    private notificationService: NotificationService,
    private contactsService: ContactsService,
    private emailsService: EmailsService
  ) {
    const tenant = this.authenticationService.getCurrentTenant();

    this.emailsService.reset();
    this.emailsService.setTenent(tenant);
    this.contactsService.setTenent(tenant);
  }

  ngOnInit(): void {
    const tables = [
      'AnagDescEmail'
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    this.user = this.authenticationService.getUserTenant();
  }

  ngOnChanges(changes: any) {
    let refresh = false;
    if (changes.contactId) {
      this.contactId = changes.contactId.currentValue;
      refresh = true;
    }
    if (changes.aziendaId) {
      this.aziendaId = changes.aziendaId.currentValue;
      refresh = true;
    }

    if (refresh) {
      this.loadData();
    }
  }

  resetData() {
    this.items = [];
  }

  loadData(loading = true) {
    this.error = false;
    this.errorMessage = '';
    if (this.contactId) {
      this.loading = loading;
      this.contactsService.getContactEmails(this.contactId, this.aziendaId || 1).subscribe(
        (response: any) => {
          this.items = response.items ? response.items.map(item => this.gridUtils.renameJson(item)) : [];
          this.loading = false;
          this.setCurrentItem(null, null, -1);
        },
        (error: any) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    } else {
      this.resetData();
    }
  }

  refresh(loading = true) {
    this.loadData(loading);
  }

  onEdit($event, item) {
    this.buildForm(item);
    this.openModal(this.editEmailModal);
  }

  onDelete($event) {
    this.emailsService.deleteModel(this.currentItem.id).subscribe(
      (resp: any) => {
        this.loading_saving = false;
        this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.emails');
        this.refresh(false);
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

  setCurrentItem(event, item, idx) {
    if (event?.altKey) {
      this.currentItem = null;
      this.selectedIndex = -1;
    } else {
      this.currentItem = item;
      this.selectedIndex = idx;
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

    this.emailsService.saveModel(data).subscribe(
      (resp: any) => {
        this.dataModel = resp;
        this.loading_saving = false;
        this.notificationService.saved();
        // this.refresh(false);
        if (!isNew && this.selectedIndex >= 0) {
          this.currentItem = resp;
          this.items[this.selectedIndex] = resp;
        }
        if (isNew) {
          this.refresh(false);
        }
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

  isOwner() {
    return (this.user?.aziendaId === this.aziendaId);
  }
}
