import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { InvoiceDdtsComponent } from './invoice-ddts.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UIModule,
    SharedPipes
  ],
  declarations: [InvoiceDdtsComponent],
  exports: [InvoiceDdtsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoiceDdtsModule { }
