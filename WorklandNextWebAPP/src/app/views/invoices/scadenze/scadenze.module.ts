import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';

import { ScadenzeComponent } from './scadenze.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule
  ],
  declarations: [ScadenzeComponent],
  exports: [ScadenzeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScadenzeModule { }
