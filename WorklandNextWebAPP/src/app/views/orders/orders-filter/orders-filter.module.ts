import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { OrdersFilterComponent } from './orders-filter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [OrdersFilterComponent],
  exports: [OrdersFilterComponent]
})
export class OrdersFilterModule { }
