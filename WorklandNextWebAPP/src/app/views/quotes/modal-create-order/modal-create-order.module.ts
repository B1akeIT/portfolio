import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { QuoteBodyModule } from '../quote-body/quote-body.module';

import { ModalCreateOrderComponent } from './modal-create-order.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    UIModule,
    SharedPipes,
    QuoteBodyModule
  ],
  entryComponents: [ModalCreateOrderComponent],
  exports: [ModalCreateOrderComponent],
  declarations: [ModalCreateOrderComponent]
})
export class ModalCreateOrderModule { }
