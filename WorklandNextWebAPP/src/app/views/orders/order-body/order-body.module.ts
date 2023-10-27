import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ModalEditModule } from '@app/views/orders/modal-order-item/modal-order-item.module';
import { OrderBodyComponent } from './order-body.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    ModalEditModule
  ],
  declarations: [OrderBodyComponent],
  exports: [OrderBodyComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderBodyModule { }
