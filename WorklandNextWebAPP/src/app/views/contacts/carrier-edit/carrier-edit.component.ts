import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { GridUtils } from '@app/utils/grid-utils';
import { TableModalService } from '@app/services/tables-modal.service';
import { ContactsService } from '@app/views/contacts/contacts.service';
import { NotificationService } from '@app/core/notifications/notification.service';

import { Carrier } from '@app/models/carrier.model';

import { APP_CONST } from '@app/shared/const';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-carrier-edit',
  templateUrl: './carrier-edit.component.html',
  styleUrls: ['./carrier-edit.component.scss']
})
export class CarrierEditComponent implements OnInit, OnChanges, OnDestroy {

  @Input() contactId = null;
  @Input() aziendaId = null;
  @Input() aziendaData = null;
  @Input() edit = false;
  @Input() readOnly = false;

  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeEdit: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;

  carrierData = null;
  wCarrierData = null;

  objectKey = Object.keys;

  excluded = APP_CONST.fieldExcluded;

  user = null;

  currentTable = null;
  tables = null;
  tableSaveSubscription: Subscription;

  constructor(
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private gridUtils: GridUtils,
    public tableMS: TableModalService,
    private contactsService: ContactsService,
    private notificationService: NotificationService
  ) { }

  ngOnChanges(changes: any) {
    if (this.contactId && this.aziendaId && this.aziendaData) {
      this.loadData();
    }
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserTenant();
    this.initData();
  }

  ngOnDestroy() {
    // this.tableSaveSubscription.unsubscribe();
  }

  initData() {
    // const tenant = this.authenticationService.getCurrentTenant();
  }

  loadData() {
    // this.edit = false;
    this.loading = true;
    this.contactsService.getContactCarrierAz(this.contactId, this.aziendaId).subscribe(
      (response: any) => {
        if (response && response.contattoId && response.aziendaId) {
          this.carrierData = JSON.parse(JSON.stringify(response));
          this.wCarrierData = JSON.parse(JSON.stringify(response));
        } else {
          this.carrierData = new Carrier({
            contattoId: this.contactId,
            aziendaId: this.aziendaId,
            trackingWebSite: ''
          });
          this.wCarrierData = this.carrierData;
        }
        // this.setFormatData();
        this.loading = false;
      }
    );
  }

  setFormatData() {
    Object.keys(this.carrierData).forEach((key) => {
      switch (key) {
        default:
          break;
      }
    });
  }

  onDelete(event) {
    this.delete.emit(event);
  }

  cancelEdit(event) {
    this.edit = false;
    this.wCarrierData = this.carrierData;
    this.closeEdit.emit(this.wCarrierData);
  }

  onEdit(event) {
    this.edit = true;
  }

  onSave(event) {
    const body = this.wCarrierData;

    this.contactsService.saveCarrier(body).subscribe(
      (response: any) => {
        this.carrierData = this.gridUtils.renameJson(response);
        this.wCarrierData = this.gridUtils.renameJson(response);
        this.setFormatData();

        this.notificationService.saved();

        this.edit = !this.edit;
        this.closeEdit.emit(this.wCarrierData);
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      }
    );
  }
}
