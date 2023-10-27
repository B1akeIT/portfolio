import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { TableModelViewModule } from '@app/components/table-model-view/table-model-view.module';

import { TableInspectorComponent } from './table-inspector.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    TableModelViewModule
  ],
  declarations: [TableInspectorComponent],
  exports: [TableInspectorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableInspectorModule { }
