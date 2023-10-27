import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ChoiceListModelComponent } from './choice-list-model.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  exports: [ChoiceListModelComponent],
  declarations: [ChoiceListModelComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChoiceListModelModule { }
