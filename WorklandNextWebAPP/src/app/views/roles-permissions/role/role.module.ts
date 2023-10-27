import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { RoleComponent } from './role.component';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionModule } from '../permission/permission.module';
import { ChooseTenantCompanyModule } from '@app/components/choose-tenant-company/choose-tenant-company.module';

@NgModule({
  declarations: [RoleComponent],
  imports: [
    CommonModule,
    SharedModule,
    PermissionsModule,
    PermissionModule,
    ChooseTenantCompanyModule
  ],
  exports: [RoleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoleModule { }
