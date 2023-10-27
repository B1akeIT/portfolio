import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { TablesRoutingModule } from './tables-routing.module';
import { TableInspectorModule } from './table-inspector/table-inspector.module';
import { TablesComponent } from './tables.component';

import { ChooseTenantCompanyModule } from '@app/components/choose-tenant-company/choose-tenant-company.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    TablesRoutingModule,
    TableInspectorModule,
    ChooseTenantCompanyModule
  ],
  declarations: [
    TablesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TablesModule { }
