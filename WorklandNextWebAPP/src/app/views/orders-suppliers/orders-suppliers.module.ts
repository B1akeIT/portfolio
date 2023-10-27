import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { OrdersSuppliersComponent } from './orders-suppliers.component';
import { OrdersSuppliersRoutingModule } from './orders-suppliers-routing.module';

import { OrderSupplierInspectorModule } from './order-supplier-inspector/order-supplier-inspector.module';
import { OrdersSuppliersFilterModule } from './orders-suppliers-filter/orders-suppliers-filter.module';
import { OrderSupplierEditViewModule } from './order-supplier-edit-view/order-supplier-edit-view.module';
import { ModalCopyModule } from '@app/components/modal-copy/modal-copy.module';
import { ModalChargeWarehouseModule } from '@app/components/modal-charge-warehouse/modal-charge-warehouse.module';

import { ChooseTenantCompanyModule } from '@app/components/choose-tenant-company/choose-tenant-company.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UIModule,
    SharedPipes,
    OrdersSuppliersRoutingModule,
    OrderSupplierInspectorModule,
    OrdersSuppliersFilterModule,
    OrderSupplierEditViewModule,
    ModalCopyModule,
    ModalChargeWarehouseModule,
    ChooseTenantCompanyModule
  ],
  declarations: [OrdersSuppliersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersSuppliersModule { }
