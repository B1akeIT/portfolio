import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-choose-tenant-company',
  templateUrl: './choose-tenant-company.component.html',
  styleUrls: [ './choose-tenant-company.component.scss' ]
})
export class ChooseTenantCompanyComponent implements OnInit, OnChanges {

  @Input() tenant = null;
  @Input() companies = [];
  @Input() company = 0;
  @Input() class = 'primary';
  @Input() dropup = false;
  @Input() right = false;
  @Input() showClear = true;

  @Output()
  changed: EventEmitter<string> = new EventEmitter<string>();

  currentCompany: any = null;

  constructor() {}

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.tenant) {
      this.tenant = changes.tenant.currentValue;
    }
    if (changes.companies) {
      // this.companies = _.filter(this.companies, function (o) {
      //   return (o.aziendaId === null);
      // });
      if (this.company) {
        const index = this.companies.findIndex(item => item.id === this.company);
        if (index !== -1) {
          this.currentCompany = this.companies[index];
        }
      }
    }
    if (changes.company) {
      this.company = changes.company.currentValue;
      const index = this.companies.findIndex(item => item.id === this.company);
      if (index !== -1) {
        this.currentCompany = this.companies[index];
      }
    }
    if (changes.class) {
      this.class = changes.class.currentValue;
    }
  }

  menuSelected(company: any) {
    this.currentCompany = company;
    this.changed.emit(this.currentCompany);
  }

  clearMenu() {
    this.menuSelected(null);
  }
}
