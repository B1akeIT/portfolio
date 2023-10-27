import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { ReadMoreComponent } from './read-more.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  exports: [ReadMoreComponent],
  declarations: [ReadMoreComponent]
})
export class ReadMoreModule { }
