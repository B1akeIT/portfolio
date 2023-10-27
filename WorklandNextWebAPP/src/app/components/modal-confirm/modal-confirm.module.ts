import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ChoiceListModelModule } from '@app/components/choice-list-model/choice-list-model.module';

import { ModalConfirmComponent } from './modal-confirm.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ChoiceListModelModule
  ],
  entryComponents: [ModalConfirmComponent],
  exports: [ModalConfirmComponent],
  declarations: [ModalConfirmComponent]
})
export class ModalConfirmModule { }
