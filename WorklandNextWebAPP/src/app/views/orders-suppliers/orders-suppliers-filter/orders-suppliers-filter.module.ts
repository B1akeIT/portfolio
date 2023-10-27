import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { OrdersSuppliersFilterComponent } from './orders-suppliers-filter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [OrdersSuppliersFilterComponent],
  exports: [OrdersSuppliersFilterComponent]
})
export class OrdersSuppliersFilterModule { }
