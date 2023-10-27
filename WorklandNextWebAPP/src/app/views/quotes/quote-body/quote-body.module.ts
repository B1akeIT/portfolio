import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ModalEditModule } from '@app/views/quotes/modal-quote-item/modal-quote-item.module';
import { QuoteBodyComponent } from './quote-body.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    ModalEditModule
  ],
  declarations: [QuoteBodyComponent],
  exports: [QuoteBodyComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuoteBodyModule { }
