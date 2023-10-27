import { Component, OnInit, Input, OnChanges }	from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { UsersService } from '../users.service';
import { TenantsService } from '@app/views/tenants/tenants.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-user-inspector',
  templateUrl: './user-inspector.component.html',
  styleUrls: ['./user-inspector.component.scss']
})
export class UserInspectorComponent implements OnInit, OnChanges {

  @Input() user = null;
  @Input() userId = null;

  @Input() showAvatar = false;
  @Input() showEdit = false;
  @Input() showIcon = true;
  @Input() showLabel = false;
  @Input() dragging = false;

  loading = false;
  loadingTenants = false;
  loadingOptions = APP_CONST.loadingOptions;
  modified = false;
  isAddNew = false;

  newTenant = null;
  tenants = [];
  tenantsMeta = null;

  options: AnimationOptions = {
    path: '/assets/animations/finger-click.json',
    loop: false
  };

  showChangePassowrd = false;
  showChangeEmail = false;
  showChangeRole = false;

  emailForm: FormGroup;
  emailModel: { email: string };
  emailFields: FormlyFieldConfig[];

  roleForm: FormGroup;
  roleModel: { roleId: number };
  roleFields: FormlyFieldConfig[];

  optionsForm: FormlyFormOptions;

  roles = [];

  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService
  ) {
    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.user ) {
      this.user = changes.user.currentValue;
    }
    if (changes.userId ) {
      this.userId = changes.userId.currentValue;
      this.loadUser();
    }
    if (changes.dragging) {
      this.dragging = changes.dragging.currentValue;
    }
  }

  ngOnInit() {
    if (this.userId) { this.loadUser(); }
    this.loadTenants();
  }

  initData() {
    this.usersService.getListRolePrincipal().subscribe(
      (response: any) => {
        this.roles = response.items;
      }
    );
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadUser() {
    this.showChangePassowrd = false;
    if (this.userId) {
      this.loading = true;
      // Get User
      this.usersService.getModel(this.userId).subscribe(
        (response: any) => {
          this.user = response;
        }
      );
      this.loading = false;
    }
  }

  getUserField(field, html = true) {
    let result = '---';

    let wa = null;

    switch (field) {
      case 'phone':
      case 'mobile':
      case 'email':
      case 'pec':
        wa = (this.user && this.user[field]) ? this.user[field] : null;
        if (wa) {
          if (html) {
            result = '<span class="badge badge- d-none">' + field + '</span>' + ' <span>' + wa + '</span>';
          } else {
            result = wa;
          }
        }
        break;

      case 'website':
        wa = (this.user && this.user[field]) ? this.user[field] : null;
        if (wa) {
          if (html) {
            result = '<a href="' + wa + '" target="_new">';
            result += '<span class="badge badge-light">' + field + '</span>' + ' <span>' + wa + '</span></a>';
          } else {
            result = wa;
          }
        }
        break;
    }

    return result;
  }

  onSaveUserTenant(user) {
    console.log('onSaveUserTenant', user);
  }

  onSaveNewUserTenant(user) {
    // console.log('onSaveNewUserTenant', this.newTenant, user);
    this.isAddNew = false;
    this.loadUser();
  }

  setStateUser() {
    this.usersService.setStateUserPrincipal(this.user.id, this.user.isActive).subscribe(
      (response: any) => {
        this.eventsManagerService.broadcast(APP_CONST.userUpdateEvent, this.user);
      }
    );
  }

  toggleChangePassword() {
    this.showChangeEmail = false;
    this.showChangeRole = false;
    this.showChangePassowrd = !this.showChangePassowrd;
  }

  onChangePassword(event) {
    this.usersService.updatePassword(this.user.id, event).subscribe(
      (response: any) => {
        if (response.succeeded) {
          this.notificationService.success('APP.MESSAGE.password_changed_message', 'APP.TITLE.change-password');
          this.toggleChangePassword();
        } else {
          const message = 'APP.MESSAGE.password_changed_error'; // response.errors?.[0].code
          this.notificationService.error(message, 'APP.TITLE.change-password');
        }
      }
    );
  }

  toggleChangeEmail() {
    this.showChangePassowrd = false;
    this.showChangeRole = false;
    this.showChangeEmail = !this.showChangeEmail;
    if (this.showChangeEmail) {
      this.emailForm = new FormGroup({});
      this.emailModel = { email: this.user.email };
      this.emailFields = [
        {
          key: 'email',
          type: 'input',
          templateOptions: {
            type: 'text',
            translate: true,
            label: 'APP.FIELD.email',
            placeholder: 'APP.FIELD.email',
            appearance: 'legacy'
          },
          validators: {
            validation: [ValidationService.emailValidator]
          }
        }
      ];
    }
  }

  onChangeEmail(event) {
    this.usersService.updateEmail(this.user.id, event).subscribe(
      (response: any) => {
        this.notificationService.success('APP.MESSAGE.email_changed_message', 'APP.TITLE.change-email');
        this.user = response;
        this.eventsManagerService.broadcast(APP_CONST.userUpdateEvent, this.user);
        this.toggleChangeEmail();
      },
      (error: any) => {
        console.log('onSave error', error);
        this.notificationService.error('APP.MESSAGE.email_changed_error', 'APP.TITLE.change-email');
      }
    );
  }

  getRoleId() {
    const roleName = this.user.roles.length > 0 ? this.user.roles[0] : '';
    const index = _.findIndex(this.roles, { name: roleName });
    return (index !== -1) ? this.roles[index].id : 0;
  }

  toggleChangeRole() {
    this.showChangePassowrd = false;
    this.showChangeEmail = false;
    this.showChangeRole = !this.showChangeRole;
    if (this.showChangeRole) {
      this.roleForm = new FormGroup({});
      this.roleModel = { roleId: this.getRoleId() };
      this.roleFields = [
        {
          key: 'roleId',
          type: 'select',
          templateOptions: {
            translate: true,
            label: 'APP.FIELD.role',
            placeholder: 'APP.FIELD.role',
            options: this.roles,
            valueProp: 'id',
            labelProp: 'name',
            appearance: 'legacy'
          },
        }
      ];
    }
  }

  onChangeRole(event) {
    this.usersService.updateRole(this.user.id, event).subscribe(
      (response: any) => {
        // console.log('onChangeRole', response);
        this.notificationService.success('APP.MESSAGE.role_changed_message', 'APP.TITLE.change-role');
        this.user = response;
        this.eventsManagerService.broadcast(APP_CONST.userUpdateEvent, this.user);
        this.toggleChangeRole();
      },
      (error: any) => {
        console.log('onSave error', error);
        this.notificationService.error('APP.MESSAGE.role_changed_error', 'APP.TITLE.change-role');
      }
    );
  }

  // Utilities

  hasNew() {
    return (this.user.tenants.length !== this.tenants.length);
  }

  hasTenant(tenant) {
    const index = _.findIndex(this.user.tenants, { tenantName: tenant.nomeConnessione });
    return (index !== -1);
  }

  toggleAddTenant() {
    this.isAddNew = !this.isAddNew;
    this.newTenant = null;
  }

  loadTenants() {
    this.loadingTenants = true;
    // load all tenants
    this.tenantsService.getListModel().subscribe(
      (response: any) => {
        this.tenants = (response.items || []);
        this.tenantsMeta = response.meta;
        this.loadingTenants = false;
      },
      (error: any) => {
        this.loadingTenants = false;
      }
    );
  }
}
