import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ModalDdtItemComponent } from './modal-ddt-item.component';

import { DdtItemModule } from '@app/views/ddt/ddt-item/ddt-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DdtItemModule
  ],
  entryComponents: [ModalDdtItemComponent],
  exports: [ModalDdtItemComponent],
  declarations: [ModalDdtItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalDdtItemModule { }
