import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { InvoicesService } from '../invoices.service';
import { ScadenzeService } from './scadenze.service';
import { GridUtils } from '@app/utils/grid-utils';

import { Scadenza } from '@app/models/scadenza.model';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-scadenze',
  templateUrl: './scadenze.component.html',
  styleUrls: ['./scadenze.component.scss']
})
export class ScadenzeComponent implements OnInit, OnChanges {

  @Input() invoiceId = null;
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

  @ViewChild('editScadenzaModal', { static: false }) editScadenzaModal;

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
    private notificationService: NotificationService,
    private invoicesService: InvoicesService,
    private scadenzeService: ScadenzeService,
    private gridUtils: GridUtils
  ) {
    const tenant = this.authenticationService.getCurrentTenant();

    this.scadenzeService.reset();
    this.scadenzeService.setTenent(tenant);
    this.invoicesService.setTenent(tenant);
  }
// http://webservice.worklandcrm.it/api/v1/Grid?nomeSp=SpComboStatoDocumento&param={"TipoDocumentoId":8,"IsStatoTestata":true}&OrderTerm=descrizione|asc
  ngOnInit(): void {
    const tables = [
      'SpComboTipoPagamento',
      { name: 'SpComboStatoDocumento', param: '{"TipoDocumentoId":8,"IsStatoTestata":true}' },
    ];
    this.utilsService.getAnagraficheCombo(tables, this.anagrafiche);

    this.user = this.authenticationService.getUserTenant();
  }

  ngOnChanges(changes: any) {
    if (changes.invoiceId) {
      this.invoiceId = changes.invoiceId.currentValue;
      this.loadData();
    }
  }

  resetData() {
    this.items = [];
  }

  loadData(loading = true) {
    this.error = false;
    this.errorMessage = '';
    if (this.invoiceId) {
      this.loading = loading;
      this.invoicesService.getScadenze(this.invoiceId, this.user?.aziendaId || 1).subscribe(
        (response: any) => {
          this.items = (response.items || []).map(item => this.gridUtils.renameJson(item));
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


  getTotals() {
    let total = 0;

    this.items.map((item) => {
      total += item.importo;
    });
    return total;
  }

  onEdit($event, item) {
    this.buildForm(item);
    this.openModal(this.editScadenzaModal);
  }

  onDelete($event) {
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
  }

  closeModal() {
    this.modalRef.hide();
  }

  buildForm(data) {
    this.dataForm = new FormGroup({});
    this.dataModel = new Scadenza(data);
    if (this.dataModel.fatturaTestataId === 0) { this.dataModel.fatturaTestataId = this.invoiceId; }
    this.dataFields = this.dataModel.formField();

    const modifiedFields = [
      {
        key: 'anagModalitaPagamentoId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.anagModalitaPagamentoId',
          placeholder: 'APP.FIELD.anagModalitaPagamentoId',
          options: this.anagrafiche['SpComboTipoPagamento'],
          valueProp: 'id',
          labelProp: 'descrizione',
          appearance: 'legacy'
        }
      },
      {
        key: 'statoDocumentoId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.statoDocumentoId',
          placeholder: 'APP.FIELD.statoDocumentoId',
          options: this.anagrafiche['SpComboStatoDocumento'],
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
    const isNew = data.id ? false : true;
    this.loading_saving = true;

    this.scadenzeService.saveModel(data).subscribe(
      (resp: any) => {
        this.dataModel = resp;
        this.loading_saving = false;
        this.notificationService.saved();
        this.refresh(false);
        // if (!isNew && this.selectedIndex >= 0) {
        //   this.currentItem = resp;
        //   this.items[this.selectedIndex] = resp;
        // }
        // if (isNew) {
        //   this.refresh(false);
        // }
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
