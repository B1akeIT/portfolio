import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { RolesPermissionsService } from './roles-permissions.service';
import { NotificationService } from '@app/core/notifications/notification.service';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})
export class RolesPermissionsComponent implements OnInit {

  roles = [];
  role = null;
  tenant = null;

  loading = false;
  loading_data = false;
  loadingOptions = APP_CONST.loadingOptions;

  error = false;
  errorMessage = '';

  status = 'view';

  tenants = [];

  constructor(
    private authenticationService: AuthenticationService,
    private rolesPermissionsService: RolesPermissionsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.tenants = this.authenticationService.getTenants();
  }

  onTenant(event) {
    this.tenant = event;
    this.rolesPermissionsService.reset();
    this.rolesPermissionsService.setTenent(this.tenant);
    this.setCurrentRole(null, null);
    this.loadRoles();
  }

  loadRoles() {
    if (this.tenant) {
      this.loading = true;
      this.rolesPermissionsService.getRoles().subscribe(
        (resp: any) => {
          this.roles = resp.items;
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    }
  }

  setCurrentRole(event, role) {
    this.status = 'view';
    if (event && event.altKey) {
      this.role = null;
    } else {
      this.role = role;
    }
  }

  isNew() {
    return (!this.role && this.status === 'edit');
  }

  isEdit() {
    return (this.status === 'edit');
  }

  onEdit(id) {
    // Ediit/New Role
    if (id === 0) {
      this.role = null;
      this.status = 'edit';
    }
  }

  onDelete(confirm) {
    if (confirm) {
      this.rolesPermissionsService.deleteRole(this.role.id).subscribe(
        (resp: any) => {
          const index = _.findIndex(this.roles, { id: this.role.id });
          if (index > -1) { this.roles.splice(index, 1); }
          this.role = null;
          this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.roles');
        },
        (error: any) => {
          console.log('error', error);
          this.notificationService.success('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.roles');
        }
      );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.tenants');
    }
  }

  onSave(role) {
    const index = _.findIndex(this.roles, { id: role.id });
    if (index === -1) {
      this.setCurrentRole(null, role);
      this.loadRoles();
    } else {
      this.roles[index] = role;
    }
  }

  onDuplicate() {
    this.rolesPermissionsService.duplicateRole(this.role.id).subscribe(
      (resp: any) => {
        this.loadRoles();
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }
}
