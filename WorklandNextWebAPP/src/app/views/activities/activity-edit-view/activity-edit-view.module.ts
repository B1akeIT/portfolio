import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ActivityEditViewComponent } from './activity-edit-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes
  ],
  declarations: [ActivityEditViewComponent],
  exports: [ActivityEditViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityEditViewModule { }
