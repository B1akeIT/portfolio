import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SharedPipes } from '@app/shared/shared.pipes';
import { UIModule } from '@app/shared/ui.module';

import { OrderInspectorComponent } from './order-inspector.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedPipes,
    UIModule
  ],
  declarations: [OrderInspectorComponent],
  exports: [OrderInspectorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderInspectorModule { }
