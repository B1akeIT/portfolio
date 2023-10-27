import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ModalOrderSupplierModule } from '@app/views/orders-suppliers/modal-order-supplier-item/modal-order-supplier-item.module';
import { OrderSupplierBodyComponent } from './order-supplier-body.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    ModalOrderSupplierModule
  ],
  declarations: [OrderSupplierBodyComponent],
  exports: [OrderSupplierBodyComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderSupplierBodyModule { }
