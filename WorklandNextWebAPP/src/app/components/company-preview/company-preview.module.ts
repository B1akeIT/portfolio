import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatExpansionModule } from '@angular/material/expansion';

import { ItemAttributeModule } from '@app/components/item-attribute';

import { CompanyPreviewComponent } from './company-preview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    BsDropdownModule,
    MatExpansionModule,
    ItemAttributeModule
  ],
  exports: [CompanyPreviewComponent],
  declarations: [CompanyPreviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CompanyPreviewsModule { }
