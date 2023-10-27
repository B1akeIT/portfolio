import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { UserTenantModule } from '../user-tenant/user-tenant.module';
import { UserPasswordModule } from '../user-password/user-password.module';
import { UserInspectorComponent } from './user-inspector.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserTenantModule,
    UserPasswordModule
  ],
  declarations: [UserInspectorComponent],
  exports: [UserInspectorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserInspectorModule { }
