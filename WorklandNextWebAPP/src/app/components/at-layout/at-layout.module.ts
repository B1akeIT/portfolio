import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ATLayoutComponent } from './at-layout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    BsDropdownModule
  ],
  exports: [ATLayoutComponent],
  declarations: [ATLayoutComponent]
})
export class ATLayoutModule { }
