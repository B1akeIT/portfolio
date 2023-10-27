import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

// import { ModalEditModule } from '@app/views/quotes/modal-advance-item/modal-advance-item.module';
import { EmailsGridListComponent } from './emails-grid-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    // ModalEditModule
  ],
  declarations: [EmailsGridListComponent],
  exports: [EmailsGridListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmailsGridListModule { }
