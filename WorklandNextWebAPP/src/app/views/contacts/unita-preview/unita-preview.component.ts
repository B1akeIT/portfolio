import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { GridUtils } from '@app/utils/grid-utils';
import { ContactsService } from '@app/views/contacts/contacts.service';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-unita-preview',
  templateUrl: './unita-preview.component.html',
  styleUrls: ['./unita-preview.component.scss']
})
export class UnitaPreviewComponent implements OnInit, OnChanges {

  @Input() unitaId = null;
  @Input() data = null;

  unitData = null;

  loading = false;

  excluded = APP_CONST.fieldExcluded;

  objectKey = Object.keys;

  constructor(
    private gridUtils: GridUtils,
    private contactsService: ContactsService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.data) {
      this.data = changes.data.currentValue;
    }
    if (changes.unitaId) {
      this.unitaId = changes.unitaId.currentValue;
      this.loadData();
    }
  }

  loadData() {
    this.loading = true;
    this.contactsService.getContactTypeAzienda(this.unitaId, 'Unita', 0).subscribe(
      (response: any) => {
        this.unitData = this.gridUtils.renameJson(response);
        this.loading = false;
      }
    );
  }
}
