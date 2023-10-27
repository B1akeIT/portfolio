import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { HelpComponent } from './help.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  exports: [HelpComponent],
  declarations: [HelpComponent]
})
export class HelpModule { }
