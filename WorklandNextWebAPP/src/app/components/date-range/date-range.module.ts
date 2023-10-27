import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { DateRangeComponent } from './date-range.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TooltipModule,
    PopoverModule
  ],
  declarations: [DateRangeComponent],
  exports: [DateRangeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DateRangeModule { }
