import { Component, OnInit, Input, OnChanges }	from '@angular/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { UtilsService } from '@app/services/utils.service';
import { TenantsService } from '../tenants.service';

@Component({
  selector: 'app-tenant-inspector',
  templateUrl: './tenant-inspector.component.html',
  styleUrls: ['./tenant-inspector.component.scss']
})
export class TenantInspectorComponent implements OnInit, OnChanges {

  @Input() tenantId = 0;
  @Input() tenantName = null;
  @Input() dragging = false;

  tenant = null;
  loading = false;
  loadingUsers = false;
  modified = false;

  users = [];
  usersMeta = null;

  options: AnimationOptions = {
    path: '/assets/animations/finger-click.json',
    loop: false
  };

  constructor(
    private utilsService: UtilsService,
    private tenantsService: TenantsService
  ) { }

  ngOnChanges(changes: any) {
    if (changes.tenantId ) {
      this.tenantId = changes.tenantId.currentValue;
      this.loadTenant();
    }
    if (changes.tenantName) {
      this.tenantName = changes.tenantName.currentValue;
      this.loadUsers();
    }
    if (changes.dragging ) {
      this.dragging = changes.dragging.currentValue;
    }
  }

  ngOnInit() {
    // this.loadTenant();
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadTenant() {
    if (this.tenantId) {
      this.loading = true;
      // Get User
      this.tenantsService.getModel(this.tenantId).subscribe(
        (response: any) => {
          this.tenant = response;
        }
      );
      this.loading = false;
    }
  }

  loadUsers() {
    if (this.tenantName) {
      this.loadingUsers = true;
      // load all users
      this.tenantsService.getUsersTenant(this.tenantName)
        .subscribe(
          (response: any) => {
            this.users = response.items;
            this.usersMeta = response.meta;
            this.loadingUsers = false;
          },
          (error: any) => {
            this.loadingUsers = false;
          }
        );
    }
  }
}
