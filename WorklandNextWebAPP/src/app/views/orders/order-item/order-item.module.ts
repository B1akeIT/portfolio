import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ModalLookupModule } from '../../../components/modal-lookup/modal-lookup.module';
import { OrderItemComponent } from './order-item.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    ModalLookupModule
  ],
  declarations: [OrderItemComponent],
  exports: [OrderItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderItemModule { }
