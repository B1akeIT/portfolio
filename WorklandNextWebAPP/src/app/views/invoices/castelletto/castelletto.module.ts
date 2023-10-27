import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';

import { CastellettoComponent } from './castelletto.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule
  ],
  declarations: [CastellettoComponent],
  exports: [CastellettoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CastellettoModule { }
