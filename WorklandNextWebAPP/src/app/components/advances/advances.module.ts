import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

// import { ModalEditModule } from '@app/views/quotes/modal-advance-item/modal-advance-item.module';
import { AdvancesComponent } from './advances.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    // ModalEditModule
  ],
  declarations: [AdvancesComponent],
  exports: [AdvancesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdvancesModule { }
