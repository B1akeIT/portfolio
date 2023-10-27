import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { WhereaboutsPreviewModule } from '../whereabouts-preview/whereabouts-preview.module';
import { ContactInspectorComponent } from './contact-inspector.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WhereaboutsPreviewModule
  ],
  declarations: [ContactInspectorComponent],
  exports: [ContactInspectorComponent]
})
export class ContactsInspectorModule { }
