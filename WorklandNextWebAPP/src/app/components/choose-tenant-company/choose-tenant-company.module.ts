import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ChooseTenantCompanyComponent } from './choose-tenant-company.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    BsDropdownModule
  ],
  exports: [ChooseTenantCompanyComponent],
  declarations: [ChooseTenantCompanyComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChooseTenantCompanyModule { }
