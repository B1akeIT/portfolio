import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';

import { UnitaEditModule } from '../unita-edit/unita-edit.module';
import { UnitaListComponent } from './unita-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    UnitaEditModule
  ],
  declarations: [UnitaListComponent],
  exports: [UnitaListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UnitaListModule { }
