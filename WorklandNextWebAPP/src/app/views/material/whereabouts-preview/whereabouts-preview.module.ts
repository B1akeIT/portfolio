import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { WhereaboutsPreviewComponent } from './whereabouts-preview.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedPipes
  ],
  declarations: [WhereaboutsPreviewComponent],
  exports: [WhereaboutsPreviewComponent]
})
export class WhereaboutsPreviewModule { }
