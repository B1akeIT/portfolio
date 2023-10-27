import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ModalOrderSupplierItemComponent } from './modal-order-supplier-item.component';

import { OrderSupplierItemModule } from '@app/views/orders-suppliers/order-supplier-item/order-supplier-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    OrderSupplierItemModule
  ],
  entryComponents: [ModalOrderSupplierItemComponent],
  exports: [ModalOrderSupplierItemComponent],
  declarations: [ModalOrderSupplierItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalOrderSupplierModule { }
