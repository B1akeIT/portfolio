import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { CarrierPreviewComponent } from './carrier-preview.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedPipes
  ],
  declarations: [CarrierPreviewComponent],
  exports: [CarrierPreviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarrierPreviewModule { }
