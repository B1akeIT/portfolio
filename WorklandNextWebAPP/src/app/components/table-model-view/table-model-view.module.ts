import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxLoadingModule } from 'ngx-loading';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { TranslateModule } from '@ngx-translate/core';

import { ItemAttributeModule } from '@app/components/item-attribute/item-attribute.module';

import { TableModelViewComponent } from './table-model-view.component';

@NgModule({
  declarations: [TableModelViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    TooltipModule,
    NgxLoadingModule,
    FormlyModule,
    FormlyMaterialModule,
    TranslateModule,
    ItemAttributeModule
  ],
  exports: [TableModelViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableModelViewModule { }
