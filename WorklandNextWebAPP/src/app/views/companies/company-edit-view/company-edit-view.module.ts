import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { CompanyEditViewComponent } from './company-edit-view.component';
import { CompanyPreviewsModule } from '@app/components/company-preview';
import { WarehouseModule } from '@app/components/warehouse';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedPipes,
    CompanyPreviewsModule,
    WarehouseModule
  ],
  declarations: [CompanyEditViewComponent],
  exports: [CompanyEditViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CompanyEditViewModule { }
