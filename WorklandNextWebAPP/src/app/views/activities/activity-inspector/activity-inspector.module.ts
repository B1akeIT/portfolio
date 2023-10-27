import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SharedPipes } from '@app/shared/shared.pipes';
import { UIModule } from '@app/shared/ui.module';

import { ActivityInspectorComponent } from './activity-inspector.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedPipes,
    UIModule
  ],
  declarations: [ActivityInspectorComponent],
  exports: [ActivityInspectorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivityInspectorModule { }
