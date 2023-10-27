import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { ItemAttributeComponent } from './item-attribute.component';

@NgModule({
  declarations: [ItemAttributeComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [ItemAttributeComponent]
})
export class ItemAttributeModule { }
