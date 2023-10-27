import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { CompaniesFilterComponent } from './companies-filter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [CompaniesFilterComponent],
  exports: [CompaniesFilterComponent]
})
export class CompaniesFilterModule { }
