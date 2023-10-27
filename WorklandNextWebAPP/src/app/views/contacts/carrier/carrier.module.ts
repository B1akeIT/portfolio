import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { CarrierEditModule } from '../carrier-edit/carrier-edit.module';

import { CarrierComponent } from './carrier.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    CarrierEditModule
  ],
  declarations: [CarrierComponent],
  exports: [CarrierComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarrierModule { }
