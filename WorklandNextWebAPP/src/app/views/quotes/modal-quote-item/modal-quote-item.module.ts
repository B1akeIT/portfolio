import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ModalQuoteEditComponent } from './modal-quote-item.component';

import { QuoteItemModule } from '@app/views/quotes/quote-item/quote-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    QuoteItemModule
  ],
  entryComponents: [ModalQuoteEditComponent],
  exports: [ModalQuoteEditComponent],
  declarations: [ModalQuoteEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalEditModule { }
