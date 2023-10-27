import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { UnitaPreviewComponent } from './unita-preview.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedPipes
  ],
  declarations: [UnitaPreviewComponent],
  exports: [UnitaPreviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UnitaPreviewModule { }
