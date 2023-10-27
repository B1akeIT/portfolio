import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ModalOrderEditComponent } from './modal-order-item.component';

import { OrderItemModule } from '@app/views/orders/order-item/order-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    OrderItemModule
  ],
  entryComponents: [ModalOrderEditComponent],
  exports: [ModalOrderEditComponent],
  declarations: [ModalOrderEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalEditModule { }
