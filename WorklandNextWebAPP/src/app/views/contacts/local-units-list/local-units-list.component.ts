import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ContactsService } from '@app/views/contacts/contacts.service';
import { TablesService } from '@app/views/tables/tables.service';
import { LocaUnitsService } from './local-units.service';

import { LocalUnit } from '@app/models/local-unit.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-local-units-list',
  templateUrl: './local-units-list.component.html',
  styleUrls: ['./local-units-list.component.scss']
})
export class LocalUnitsListComponent implements OnInit, OnChanges {

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

  @ViewChild('editUnitModal', { static: false }) editUnitModal;

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
    private locaUnitsService: LocaUnitsService,
    private tablesService: TablesService
  ) { }

  ngOnInit(): void {
    const tenant = this.authenticationService.getCurrentTenant();

    this.locaUnitsService.reset();
    this.locaUnitsService.setTenent(tenant);

    const tables = [
      'AnagNazione'
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    this.user = this.authenticationService.getUserTenant();
  }

  ngOnChanges(changes: any) {
    // if (changes.items) {
    //   this.items = changes.items.currentValue;
    //   if (this.items.length > 0) { this.currentItem = this.items[0]; }
    //   this.loadData();
    // }
    if (changes.contactId) {
      this.contactId = changes.contactId.currentValue;
      this.loadData();
    }
  }

  loadData(loading = true) {
    this.loading = loading;
    this.contactsService.getContactLocalUnits(this.contactId).subscribe(
      (response: any) => {
        this.items = response.items ? response.items.map(item => this.gridUtils.renameJson(item)) : [];
        this.loading = false;
        this.setCurrentItem(null, null, -1);
      }
    );
  }

  refresh(loading = true) {
    this.loadData(loading);
  }

  onEdit($event, item) {
    this.buildForm(item);
    this.openModal(this.editUnitModal);
  }

  onDelete($event) {
    this.locaUnitsService.deleteModel(this.currentItem.id).subscribe(
      (response) => {
        this.refresh();
      },
      (error) => {
        console.log('error', error);
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

    this.dataForm = new FormGroup({});
    this.dataModel = new LocalUnit(data);
    if (this.dataModel.contattoPrincipaleId === 0) { this.dataModel.contattoPrincipaleId = this.contactId; }
    this.dataFields = this.dataModel.formField();

    const modifiedFields = [
      {
        key: 'anagNazioneId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.anagNazioneId',
          placeholder: 'APP.FIELD.anagNazioneId',
          options: this.anagrafiche['AnagNazione'],
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

    this.locaUnitsService.saveModel(data).subscribe(
      (resp: any) => {
        this.dataModel = resp;
        this.loading_saving = false;
        this.notificationService.saved();
        if (!isNew && this.selectedIndex >= 0) {
          const _item = this.gridUtils.renameJson(resp);
          this.currentItem = _item;
          this.items[this.selectedIndex] = _item;
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
}
