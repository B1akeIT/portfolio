import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { ModalCopyComponent } from './modal-copy.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    UIModule,
    SharedPipes
  ],
  entryComponents: [ModalCopyComponent],
  exports: [ModalCopyComponent],
  declarations: [ModalCopyComponent]
})
export class ModalCopyModule { }
