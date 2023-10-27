import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';

import { TableModelViewModule } from '@app/components/table-model-view/table-model-view.module';
import { TableInspectorModule } from '@app/views/tables/table-inspector/table-inspector.module';

import { ModalTableManagerComponent } from './modal-table-manager.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    TableModelViewModule,
    TableInspectorModule
  ],
  entryComponents: [ModalTableManagerComponent],
  exports: [ModalTableManagerComponent],
  declarations: [ModalTableManagerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalTableManagerModule { }
