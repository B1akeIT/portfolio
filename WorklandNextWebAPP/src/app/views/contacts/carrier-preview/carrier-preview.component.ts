import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { ContactsService } from '@app/views/contacts/contacts.service';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-carrier-preview',
  templateUrl: './carrier-preview.component.html',
  styleUrls: ['./carrier-preview.component.scss']
})
export class CarrierPreviewComponent implements OnInit, OnChanges {

  @Input() contattoId = null;
  @Input() aziendaId = null;
  @Input() data = null;

  carrierData = null;

  loading = false;

  excluded = APP_CONST.fieldExcluded;

  objectKey = Object.keys;

  constructor(
    private contactsService: ContactsService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.contattoId || changes.aziendaId) {
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    this.contactsService.getContactCarrier(this.contattoId, this.aziendaId).subscribe(
      (resp: any) => {
        this.carrierData = resp;
        this.loading = false;
      }
    );
  }
}
