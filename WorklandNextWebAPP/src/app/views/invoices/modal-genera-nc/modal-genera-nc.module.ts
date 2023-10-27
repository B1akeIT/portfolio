import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { InvoiceBodyModule } from '../invoice-body/invoice-body.module';

import { ModalGeneraNcComponent } from './modal-genera-nc.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    UIModule,
    SharedPipes,
    InvoiceBodyModule
  ],
  entryComponents: [ModalGeneraNcComponent],
  exports: [ModalGeneraNcComponent],
  declarations: [ModalGeneraNcComponent]
})
export class ModalGeneraNcModule { }
