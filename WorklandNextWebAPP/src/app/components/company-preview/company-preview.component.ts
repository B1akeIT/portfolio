import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';

import { CompanyPreviewService } from './company-preview.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-company-preview',
  templateUrl: './company-preview.component.html',
  styleUrls: [ './company-preview.component.scss' ]
})
export class CompanyPreviewComponent implements OnInit, OnChanges {

  @Input() tenant = null;
  @Input() companyId = null;
  @Input() class = '';

  company: any = null;

  loading = false;

  fieldExcluded = APP_CONST.fieldExcluded;

  constructor(
    private companyPreviewService: CompanyPreviewService,
    public gridUtils: GridUtils
  ) {}

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.tenant) {
      this.tenant = changes.tenant.currentValue;
      this.companyPreviewService.setTenent(this.tenant);
    }
    if (changes.companyId) {
      this.companyId = changes.companyId.currentValue;
      this.loadCompany();
    }
    if (changes.class) {
      this.class = changes.class.currentValue;
    }
  }

  loadCompany() {
    this.loading = true;
    this.companyPreviewService.getModel(this.companyId).subscribe(
      (resp: any) => {
        this.company = this.gridUtils.renameJson(resp);
        this.loading = false;
      }
    );
  }
}
