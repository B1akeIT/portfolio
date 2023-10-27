import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { CompaniesSortingComponent } from './companies-sorting.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [CompaniesSortingComponent],
  exports: [CompaniesSortingComponent]
})
export class CompaniesSortingModule { }
