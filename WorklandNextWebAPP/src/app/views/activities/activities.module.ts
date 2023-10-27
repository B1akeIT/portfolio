import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ActivitiesComponent } from './activities.component';
import { ActivitiesRoutingModule } from './activities-routing.module';

import { ActivityInspectorModule } from './activity-inspector/activity-inspector.module';
import { ActivityEditViewModule } from './activity-edit-view/activity-edit-view.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UIModule,
    SharedPipes,
    ActivitiesRoutingModule,
    ActivityInspectorModule,
    ActivityEditViewModule
  ],
  declarations: [ActivitiesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActivitiesModule { }
