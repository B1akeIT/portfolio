import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { GridUtils } from '@app/utils/grid-utils';

import { AuthenticationService } from '@app/services/authentication.service';
import { InvoicesService } from '../invoices.service';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-castelletto',
  templateUrl: './castelletto.component.html',
  styleUrls: ['./castelletto.component.scss']
})
export class CastellettoComponent implements OnInit, OnChanges {

  @Input() invoiceId = null;
  @Input() aziendaId = null;
  @Input() small = false;
  @Input() onlyRead = false;

  items = [];

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;

  error = false;
  errorMessage = '';

  currentItem = null;

  user = null;

  selectedIndex = -1;

  edit = false;

  excluded = APP_CONST.fieldExcluded;

  constructor(
    private translate: TranslateService,
    private gridUtils: GridUtils,
    private authenticationService: AuthenticationService,
    private invoicesService: InvoicesService,
  ) {
    const tenant = this.authenticationService.getCurrentTenant();

    this.invoicesService.reset();
    this.invoicesService.setTenent(tenant);
  }

  ngOnInit(): void {
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
      this.invoicesService.getCastelletto(this.invoiceId, this.user?.aziendaId || 1).subscribe(
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

  setCurrentItem(event, item, idx) {
    if (event?.altKey) {
      this.currentItem = null;
      this.selectedIndex = -1;
    } else {
      this.currentItem = item;
      this.selectedIndex = idx;
    }
  }
}
