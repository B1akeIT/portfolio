import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { GridUtils } from '@app/utils/grid-utils';
import { ContactsService } from '@app/views/contacts/contacts.service';
import { CreditCard } from '@app/models/credit-card.model';
import { CreditCardsService } from './credit-cards.service';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-credit-cards',
  templateUrl: './credit-cards.component.html',
  styleUrls: ['./credit-cards.component.scss']
})
export class CreditCardsComponent implements OnInit, OnChanges {

  @Input() clienteId = 0;
  @Input() clienteContabilitaId = 0;
  @Input() aziendaId = 0;
  @Input() items = [];
  @Input() readOnly = false;

  @ViewChild('editCCModal', { static: false }) editCCModal;

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  loading_saving = false;

  error = false;
  errorMessage = '';

  modalCCRef: BsModalRef;

  dataForm: FormGroup;
  dataModel: any;
  dataFields: Array<FormlyFieldConfig>;
  optionsForm: FormlyFormOptions;

  tenant = '';

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private gridUtils: GridUtils,
    private contactsService: ContactsService,
    private creditCardsService: CreditCardsService
  ) {
    this.tenant = this.authenticationService.getCurrentTenant();

    this.creditCardsService.reset();
    this.creditCardsService.setPerPage(0);
    this.creditCardsService.setTenent(this.tenant);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    let refresh = false;
    if (changes.clienteContabilitaId) {
      this.clienteContabilitaId = changes.clienteContabilitaId.currentValue;
      refresh = true;
    }
    if (changes.aziendaId) {
      this.aziendaId = changes.aziendaId.currentValue;
      refresh = true;
    }

    if (refresh) {
      this.getListCC();
    }
  }

  onEdit($event, item) {
    this.dataModel = new CreditCard(item);
    if (_.isEmpty(item)) {
      this.dataModel.clienteContabilitaId = this.clienteContabilitaId;
    }
    this.dataFields = this.dataModel.formField();
    this.openCCModal(this.editCCModal);
  }

  onDelete($event, item) {
    if (item) {
      this.creditCardsService.deleteModel(item.id).subscribe(
        (response) => {
          this.getListCC();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  openCCModal(template: TemplateRef<any>) {
    this.buildForm();
    this.modalCCRef = this.modalService.show(template, {
      ignoreBackdropClick: false,
      // class: 'modal-lg-custom'
    });
    // Refresh data
  }

  closeModal() {
    this.modalCCRef.hide();
  }

  buildForm() {
    this.dataForm = new FormGroup({});
  }

  onSave(data) {
    this.loading_saving = true;

    this.creditCardsService.saveModel(data).subscribe(
      (resp: any) => {
        this.dataModel = resp;
        this.closeModal();

        this.notificationService.saved();

        this.getListCC();
        this.loading_saving = false;
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

  getListCC() {
    this.loading = true;
    this.creditCardsService.getListModelByCID(this.clienteContabilitaId, this.aziendaId).subscribe(
      (response: any) => {
        this.items = (response.items || []).map(item => this.gridUtils.renameJson(item));
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
