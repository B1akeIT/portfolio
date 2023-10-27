import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ModalContactComponent } from './modal-contact.component';

import { ContactEditViewModule } from '@app/views/contacts/contact-edit-view/contact-edit-view.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ContactEditViewModule
  ],
  entryComponents: [ModalContactComponent],
  exports: [ModalContactComponent],
  declarations: [ModalContactComponent]
})
export class ModalContactModule { }
