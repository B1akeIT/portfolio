import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { ChooseTenantModule } from '@app/components/choose-tenant/choose-tenant.module';

import { RolesPermissionsRoutingModule } from './roles-permissions-routing.module';
import { RolesPermissionsComponent } from './roles-permissions.component';
import { RoleModule } from './role/role.module';

@NgModule({
  declarations: [RolesPermissionsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChooseTenantModule,
    RolesPermissionsRoutingModule,
    RoleModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RolesPermissionsModule { }
