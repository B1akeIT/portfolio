import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';

import { APP_CONST } from '@app/shared';

@Component({
  selector: 'app-choose-tenant',
  templateUrl: './choose-tenant.component.html',
  styleUrls: [ './choose-tenant.component.scss' ]
})
export class ChooseTenantComponent implements OnInit, OnChanges {

  @Input() tenants = [];
  @Input() class = 'primary';

  @Output()
  changed: EventEmitter<string> = new EventEmitter<string>();

  currentTenant: any = null;

  constructor() {}

  ngOnInit() {
    this.menuSelected(this.getCurrentTenant());
  }

  ngOnChanges(changes: any) {
    if (changes.tenants) {
      this.tenants = changes.tenants.currentValue;
      this.setAutoTenant();
    }
    if (changes.class) {
      this.class = changes.class.currentValue;
    }
  }

  getCurrentTenant() {
    const storage = localStorage.getItem(APP_CONST.storageTenant);
    if (storage) {
      const currentTenant = JSON.parse(decodeURI(atob(storage)));
      return currentTenant?.tenant ?? null;
    }
    return null;
  }

  menuSelected(tenant: any) {
    this.currentTenant = tenant;
    this.changed.emit(this.currentTenant);
  }

  clearMenu() {
    this.menuSelected(null);
  }

  setAutoTenant() {
    if (!this.currentTenant) {
      if (this.tenants.length === 1) {
        this.currentTenant = this.tenants[0].tenantName;
        this.changed.emit(this.currentTenant);
      }
    }
  }
}
