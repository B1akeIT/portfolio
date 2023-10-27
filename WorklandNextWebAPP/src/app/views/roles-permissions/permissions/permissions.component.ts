import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { TablesService } from '@app/views/tables/tables.service';

import { RolesPermissionsService } from '../roles-permissions.service';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, OnChanges {

  @Input() roleId = null;
  @Input() tenant = null;

  roleData = null;

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;

  error = false;
  errorMessage = '';

  companies = [];
  currentCompany = null;

  owner = true;
  permissions = [];
  permissionGroups = [];

  grouped = true;


  anagraficheCombo = [];

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private tablesService: TablesService,
    private rolesPermissionsService: RolesPermissionsService
  ) {}

  ngOnInit(): void {
    this.tenant = this.authenticationService.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.tenant);

    const combos = [
      'SpComboAzienda',
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
    // this.loadCompanies();

    // this.rolesPermissionsService.getJson('permissions').subscribe(
    //   (resp: any) => {
    //     this.permissions = resp.data;
    //   }
    // );
  }

  ngOnChanges(changes: any) {
    if (changes.roleId) {
      this.roleId = changes.roleId.currentValue;
      this.reset();
      // this.loadRoleData();
    }
  }

  reset() {
    this.currentCompany = null;
    this.owner = true;
    this.permissions = [];
  }

  loadCompanies() {
    this.rolesPermissionsService.getAziende().subscribe(
    // this.rolesPermissionsService.getJson('companies').subscribe(
      (resp: any) => {
        // let companies = [];
        // companies = _.map(resp, 'contatto');
        this.companies = resp; // companies;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  onCompany(event) {
    this.currentCompany = event;
    this.loadPermissions();
  }

  loadRoleData() {
    if (this.roleId) {
      this.rolesPermissionsService.getRole(this.roleId).subscribe(
        (resp: any) => {
          this.roleData = resp;
        },
        (error: any) => {
          this.roleData = null;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    }
  }

  loadPermissions() {
    if (this.roleId && this.currentCompany) {
      this.loading = true;
      this.rolesPermissionsService.getRolePermissions(this.roleId, this.currentCompany.id).subscribe(
        (resp: any) => {
          this.permissions = resp;
          const groups = _.groupBy(this.permissions, 'moduloId');
          const keys = _.keys(groups);
          this.permissionGroups = [];
          keys.forEach(key => {
            this.permissionGroups.push({
              modulo: groups[key][0].modulo,
              moduloId: key,
              items: groups[key]
            });
          });
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

  onChange(event, field) {
    console.log('onChange', field);
  }
}
