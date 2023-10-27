import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { AccountingDataComponent } from './accounting-data.component'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedPipes
  ],
  declarations: [AccountingDataComponent],
  exports: [AccountingDataComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountingDataModule { }
