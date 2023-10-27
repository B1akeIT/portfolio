import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ContactsService } from '@app/views/contacts/contacts.service';
import { UnitaService } from './unita.service';

import { ModalChoicesComponent } from '@app/components/modal-choices/modal-choices.component';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-unita-list',
  templateUrl: './unita-list.component.html',
  styleUrls: ['./unita-list.component.scss']
})
export class UnitaListComponent implements OnInit, OnChanges {

  @Input() contactId = 0;
  @Input() contact = null;
  @Input() clientId = 0;
  @Input() items = [];
  @Input() readOnly = false;

  @Output() reload: EventEmitter<any> = new EventEmitter<any>();

  tabsItems = [];

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;

  currentItem = null;

  user = null;

  selectedIndex = -1;

  addUnita = false;
  trasform = false;

  modalChoiceRef: BsModalRef;

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private contactsService: ContactsService,
    private unitaService: UnitaService,
    private notificationService: NotificationService,
  ) {
    this.user = this.authenticationService.getUserTenant();

    const tenant = this.authenticationService.getCurrentTenant();
    this.unitaService.reset();
    this.unitaService.setTenent(tenant);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    // if (changes.contactId) {
    //   this.contactId = changes.contactId.currentValue;
    //   this.loadData();
    // }
    if (changes.clientId) {
      this.clientId = changes.clientId.currentValue;
      this.loadData();
    }
    // if (changes.items) {
    //   this.items = changes.items.currentValue;
    //   if (this.items && this.items.length > 0) { this.currentItem = this.items[0]; }
    // }
  }

  loadData() {
    if (this.clientId !== null) {
      this.loading = true;
      this.contactsService.getClientUnits(this.clientId).subscribe(
        (resp: any) => {
          this.tabsItems = resp.map(
            item => ({
                id: item.id,
                unitaId: item.id,
                name: item.ragioneSociale,
              })
          );

          if (this.tabsItems && this.tabsItems.length === 0) { this.tabsItems = this.items; }
          if (this.tabsItems && this.tabsItems.length > 0) { this.currentItem = this.tabsItems[0]; }
          this.loading = false;
        }
      );
    }
  }

  onRefresh(event) {
    this.loadData();
  }

  onEdit(event, item, trasform = false) {
    if (!item) {
      this.currentItem = {
        unitaId: 0,
        name: this.translate.instant('APP.TITLE.new_unit')
      };
      this.addUnita = true;
      this.trasform = trasform;
    }
  }

  onCollega(event) {
    this.unitaService.collega(event, this.clientId).subscribe(
      (response: any) => {
        this.notificationService.saved();
        this.onRefresh(null);
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      }
    );
  }

  onScollega(event) {
    this.unitaService.scollega(event, this.clientId).subscribe(
      (response: any) => {
        this.onRefresh(null);
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      }
    );
  }

  onCloseEdit(event) {
    if (this.addUnita) {
      this.addUnita = false;
      if (this.trasform) {
        this.trasform = false;
        this.currentItem = null;
      }
      if (event && event.reload) {
        this.reload.emit({ reload: true });
      } else {
        this.loadData();
      }
    }
  }

  setCurrentItem(event, item) {
    if (event?.altKey) {
      this.currentItem = null;
    } else {
      this.currentItem = item;
    }
  }

  openChoiceModal(model) {
    const initialState = {
      model: model,
      contactType: 'Unita'
    };
    this.modalChoiceRef = this.modalService.show(ModalChoicesComponent, {
      ignoreBackdropClick: true,
      // class: 'modal-lg-custom'
      initialState: initialState
    });
    this.modalChoiceRef.content.onClose.subscribe(
      (result: any) => {
        this.onCollega(result.item.datiUnita.id);
      }
    );
  }
}
