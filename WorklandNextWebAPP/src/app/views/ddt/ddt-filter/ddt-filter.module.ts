import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { DdtFilterComponent } from './ddt-filter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [DdtFilterComponent],
  exports: [DdtFilterComponent]
})
export class DdtFilterModule { }
