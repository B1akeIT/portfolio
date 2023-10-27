import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { OrderSupplierBodyModule } from '@app/views/orders-suppliers/order-supplier-body/order-supplier-body.module';

import { ModalChargeWarehouseComponent } from './modal-charge-warehouse.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    UIModule,
    SharedPipes,
    OrderSupplierBodyModule
  ],
  entryComponents: [ModalChargeWarehouseComponent],
  exports: [ModalChargeWarehouseComponent],
  declarations: [ModalChargeWarehouseComponent]
})
export class ModalChargeWarehouseModule { }
