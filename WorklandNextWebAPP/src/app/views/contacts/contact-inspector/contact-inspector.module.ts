import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SharedPipes } from '@app/shared/shared.pipes';
import { UIModule } from '@app/shared/ui.module';

import { AccountingDataModule } from '../accounting-data/accounting-data.module';
import { UnitaPreviewModule } from '../unita-preview/unita-preview.module';
import { CarrierPreviewModule } from '../carrier-preview/carrier-preview.module';
import { ContactInspectorComponent } from './contact-inspector.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedPipes,
    UIModule,
    AccountingDataModule,
    UnitaPreviewModule,
    CarrierPreviewModule
  ],
  declarations: [ContactInspectorComponent],
  exports: [ContactInspectorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactInspectorModule { }
