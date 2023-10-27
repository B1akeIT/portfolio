import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { ModalChoicesModule } from '@app/components/modal-choices/modal-choices.module';

import { ReferencesListComponent } from './references-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    ModalChoicesModule
  ],
  declarations: [ReferencesListComponent],
  exports: [ReferencesListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReferencessListModule { }
