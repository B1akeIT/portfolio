import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { ContactsFilterComponent } from './contacts-filter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ContactsFilterComponent],
  exports: [ContactsFilterComponent]
})
export class ContactsFilterModule { }
