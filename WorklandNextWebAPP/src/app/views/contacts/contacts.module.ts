import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ContactsComponent } from './contacts.component';
import { ContactsRoutingModule } from './contacts-routing.module';

import { ContactInspectorModule } from './contact-inspector/contact-inspector.module';
import { ContactsFilterModule } from './contacts-filter/contacts-filter.module';
import { ContactEditViewModule } from './contact-edit-view/contact-edit-view.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UIModule,
    SharedPipes,
    ContactsRoutingModule,
    ContactInspectorModule,
    ContactsFilterModule,
    ContactEditViewModule
  ],
  declarations: [ContactsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactsModule { }
