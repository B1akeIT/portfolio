import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { PermissionsComponent } from './permissions.component';
import { PermissionModule } from '../permission/permission.module';
import { ChooseTenantCompanyModule } from '@app/components/choose-tenant-company/choose-tenant-company.module';

@NgModule({
  declarations: [PermissionsComponent],
  imports: [
    CommonModule,
    SharedModule,
    PermissionModule,
    ChooseTenantCompanyModule
  ],
  exports: [PermissionsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PermissionsModule { }
