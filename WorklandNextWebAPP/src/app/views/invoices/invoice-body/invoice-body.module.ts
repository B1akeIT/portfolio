import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ModalEditModule } from '@app/views/invoices/modal-invoice-item/modal-invoice-item.module';
import { InvoiceBodyComponent } from './invoice-body.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    ModalEditModule
  ],
  declarations: [InvoiceBodyComponent],
  exports: [InvoiceBodyComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoiceBodyModule { }
