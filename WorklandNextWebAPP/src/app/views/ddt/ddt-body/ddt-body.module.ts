import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ModalDdtItemModule } from '@app/views/ddt/modal-ddt-item/modal-ddt-item.module';
import { DdtBodyComponent } from './ddt-body.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    ModalDdtItemModule
  ],
  declarations: [DdtBodyComponent],
  exports: [DdtBodyComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DdtBodyModule { }
