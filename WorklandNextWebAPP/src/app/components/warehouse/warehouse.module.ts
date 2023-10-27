import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxLoadingModule } from 'ngx-loading';

import { FormlyModule } from '@ngx-formly/core';
// import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { TranslateModule } from '@ngx-translate/core';

import { GoogleMapsModule } from '@angular/google-maps';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatExpansionModule } from '@angular/material/expansion';

import { ItemAttributeModule } from '@app/components/item-attribute';

import { WarehouseComponent } from './warehouse.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    TooltipModule,
    NgxLoadingModule,
    FormlyModule,
    // FormlyMaterialModule,
    FormlyBootstrapModule,
    TranslateModule,
    GoogleMapsModule,
    BsDropdownModule,
    MatExpansionModule,
    ItemAttributeModule
  ],
  exports: [WarehouseComponent],
  declarations: [WarehouseComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WarehouseModule { }
