import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { ContactsService } from '@app/views/contacts/contacts.service';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-accounting-data',
  templateUrl: './accounting-data.component.html',
  styleUrls: ['./accounting-data.component.scss']
})
export class AccountingDataComponent implements OnInit, OnChanges {

  @Input() contactId = null;
  @Input() aziendaId = null;
  @Input() type = null;
  @Input() data = null;

  accountingData = null;

  loading = false;

  excluded = APP_CONST.fieldExcluded;

  objectKey = Object.keys;

  constructor(
    private contactsService: ContactsService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.data) {
      this.data = changes.data.currentValue;
    }

    if (this.contactId && this.aziendaId && this.type) {
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    this.contactsService.getContactTypeAzienda(this.contactId, this.type, this.aziendaId).subscribe(
      (resp: any) => {
        this.accountingData = resp;
        this.loading = false;
      }
    );
  }
}
