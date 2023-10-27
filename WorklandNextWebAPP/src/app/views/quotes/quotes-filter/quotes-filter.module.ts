import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { QuotesFilterComponent } from './quotes-filter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [QuotesFilterComponent],
  exports: [QuotesFilterComponent]
})
export class QuotesFilterModule { }
