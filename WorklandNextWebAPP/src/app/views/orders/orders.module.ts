import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';

import { OrderInspectorModule } from './orders-inspector/order-inspector.module';
import { OrdersFilterModule } from './orders-filter/orders-filter.module';
import { OrderEditViewModule } from './order-edit-view/order-edit-view.module';
import { ModalCopyModule } from '@app/components/modal-copy/modal-copy.module';
import { ModalCreateDocModule } from './modal-create-doc/modal-create-doc.module';
import { ModalOrdersSuppliersModule } from './modal-orders-suppliers/modal-orders-suppliers.module';

import { ChooseTenantCompanyModule } from '@app/components/choose-tenant-company/choose-tenant-company.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UIModule,
    SharedPipes,
    OrdersRoutingModule,
    OrderInspectorModule,
    OrdersFilterModule,
    OrderEditViewModule,
    ModalCopyModule,
    ModalCreateDocModule,
    ModalOrdersSuppliersModule,
    ChooseTenantCompanyModule
  ],
  declarations: [OrdersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersModule { }
