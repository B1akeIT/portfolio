import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { UserTenantModule } from '../../users/user-tenant/user-tenant.module';
import { TenantInspectorComponent } from './tenant-inspector.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserTenantModule
  ],
  declarations: [TenantInspectorComponent],
  exports: [TenantInspectorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TenantInspectorModule { }
