import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';

import { AccountingDataModule } from '../accounting-data/accounting-data.module';
import { AccountingEditModule } from '../accounting-edit/accounting-edit.module';

import { ClientSupplierComponent } from './client-supplier.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    AccountingDataModule,
    AccountingEditModule
  ],
  declarations: [ClientSupplierComponent],
  exports: [ClientSupplierComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientSupplierModule { }
