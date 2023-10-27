import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { MaterialComponent } from './material.component';
import { MaterialRoutingModule } from './material-routing.module';

import { SharedModule } from '@app/shared/shared.module';

import { ContactsInspectorModule } from './contact-inspector/contacts-inspector.module';
import { WhereaboutsPreviewModule } from './whereabouts-preview/whereabouts-preview.module';
import { ContactsFilterModule } from './contacts-filter/contacts-filter.module';
import { ContactsSortingModule } from './contacts-sorting/contacts-sorting.module';

@NgModule({
  imports: [
    FormsModule,
    MaterialRoutingModule,
    ChartsModule,
    SharedModule,
    ContactsInspectorModule,
    WhereaboutsPreviewModule,
    ContactsFilterModule,
    ContactsSortingModule
  ],
  declarations: [ MaterialComponent ]
})
export class MaterialModule { }
