import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { DdtComponent } from './ddt.component';
import { DdtRoutingModule } from './ddt-routing.module';

import { DdtInspectorModule } from './ddt-inspector/ddt-inspector.module';
import { DdtFilterModule } from './ddt-filter/ddt-filter.module';
import { DdtEditViewModule } from './ddt-edit-view/ddt-edit-view.module';
import { ModalCopyModule } from '@app/components/modal-copy/modal-copy.module';
import { ModalChargeWarehouseModule } from '@app/components/modal-charge-warehouse/modal-charge-warehouse.module';

import { ChooseTenantCompanyModule } from '@app/components/choose-tenant-company/choose-tenant-company.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UIModule,
    SharedPipes,
    DdtRoutingModule,
    DdtInspectorModule,
    DdtFilterModule,
    DdtEditViewModule,
    ModalCopyModule,
    ModalChargeWarehouseModule,
    ChooseTenantCompanyModule
  ],
  declarations: [DdtComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DdtModule { }
