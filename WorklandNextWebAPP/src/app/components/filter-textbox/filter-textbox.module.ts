import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { FilterTextboxComponent } from './filter-textbox.component';

@NgModule({
  imports: [CommonModule, FormsModule, TranslateModule],
  exports: [FilterTextboxComponent],
  declarations: [FilterTextboxComponent]
})
export class FilterTextboxModule { }
