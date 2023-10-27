import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { GridUtils } from '@app/utils/grid-utils';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ContactsService } from '@app/views/contacts/contacts.service';
import { ReferencesService } from './references.service';

import { ModalChoicesComponent } from '@app/components/modal-choices/modal-choices.component';

import { Reference } from '@app/models/reference.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-references-list',
  templateUrl: './references-list.component.html',
  styleUrls: ['./references-list.component.scss']
})
export class ReferencesListComponent implements OnInit, OnChanges {

  @Input() contactId = [];
  @Input() showListAction = false;
  @Input() readOnly = false;

  items = [];

  loading = false;
  loading_saving = false;
  loadingOptions = APP_CONST.loadingOptions;

  error = false;
  errorMessage = '';

  currentItem = null;

  user = null;

  selectedIndex = -1;

  excluded = APP_CONST.fieldExcluded;

  @ViewChild('editReferenceModal', { static: false }) editReferenceModal;

  modalChoiceRef: BsModalRef;
  modalRef: BsModalRef;

  dataForm: FormGroup;
  dataModel: any;
  dataFields: Array<FormlyFieldConfig>;
  optionsForm: FormlyFormOptions;

  currentContact = null;

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private gridUtils: GridUtils,
    private notificationService: NotificationService,
    private contactsService: ContactsService,
    private referencesService: ReferencesService
  ) { }

  ngOnInit(): void {
    const tenant = this.authenticationService.getCurrentTenant();

    this.referencesService.reset();
    this.referencesService.setTenent(tenant);

    this.user = this.authenticationService.getUserTenant();
  }

  ngOnChanges(changes: any) {
    if (changes.contactId) {
      this.contactId = changes.contactId.currentValue;
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    this.contactsService.getContactReferences(this.contactId).subscribe(
      (response: any) => {
        this.items = response.items ? response.items.map(item => this.gridUtils.renameJson(item)) : [];
        this.loading = false;
        this.setCurrentItem(null, null, -1);
      }
    );
  }

  refresh() {
    this.loadData();
  }

  onEdit($event, item) {
    this.currentItem = item;
    this.buildForm(item);
    this.openModal(this.editReferenceModal);
  }

  onDelete($event) {
    if (this.currentItem) {
      this.referencesService.deleteModel(this.currentItem.id).subscribe(
        (response) => {
          this.refresh();
        },
        (error) => {
          console.log(error);
        }
      );
    }
    console.log('onDelete', this.currentItem);
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
    // Refresh data
  }

  closeModal() {
    this.modalRef.hide();
  }

  buildForm(data) {
    this.currentContact = this.currentItem?.rifContatto || null;

    this.dataForm = new FormGroup({});
    this.dataModel = new Reference(data);
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
    this.loading_saving = true;

    delete data.rifContatto;

    this.referencesService.saveModel(data).subscribe(
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

  openChoiceModal(model) {
    const initialState = {
      model: model
    };
    this.modalChoiceRef = this.modalService.show(ModalChoicesComponent, {
      ignoreBackdropClick: true,
      // class: 'modal-lg-custom'
      initialState: initialState
    });
    this.modalChoiceRef.content.onClose.subscribe(
      (result: any) => {
        // console.log('openChoiceModal', result.model, result.item);
        this.currentContact = result.item;
        this.dataModel.riferimentoContattoId = result.item.id;
      }
    );
  }
}
