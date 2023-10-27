import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { ContactsSortingComponent } from './contacts-sorting.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ContactsSortingComponent],
  exports: [ContactsSortingComponent]
})
export class ContactsSortingModule { }
