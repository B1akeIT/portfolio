import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';

import { LocalUnitsListComponent } from './local-units-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule
  ],
  declarations: [LocalUnitsListComponent],
  exports: [LocalUnitsListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LocalUnitListModule { }
