import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { UserTenantComponent } from './user-tenant.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [UserTenantComponent],
  exports: [UserTenantComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserTenantModule { }
