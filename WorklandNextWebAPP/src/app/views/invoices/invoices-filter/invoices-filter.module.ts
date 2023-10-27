import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { InvoicesFilterComponent } from './invoices-filter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [InvoicesFilterComponent],
  exports: [InvoicesFilterComponent]
})
export class InvoicesFilterModule { }
