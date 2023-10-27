import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ModalInvoiceEditComponent } from './modal-invoice-item.component';

import { InvoiceItemModule } from '@app/views/invoices/invoice-item/invoice-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InvoiceItemModule
  ],
  entryComponents: [ModalInvoiceEditComponent],
  exports: [ModalInvoiceEditComponent],
  declarations: [ModalInvoiceEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalEditModule { }
