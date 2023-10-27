import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { DdtOrdersComponent } from './ddt-orders.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UIModule,
    SharedPipes
  ],
  declarations: [DdtOrdersComponent],
  exports: [DdtOrdersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DdtOrdersModule { }
