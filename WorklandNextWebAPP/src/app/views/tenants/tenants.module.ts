import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { TenantsComponent } from './tenants.component';
import { TenantsRoutingModule } from './tenants-routing.module';

import { TenantInspectorModule } from './tenant-inspector/tenant-inspector.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    TenantsRoutingModule,
    TenantInspectorModule
  ],
  declarations: [TenantsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TenantsModule { }
