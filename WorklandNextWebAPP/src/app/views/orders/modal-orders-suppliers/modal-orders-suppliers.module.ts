import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { OrderBodyModule } from '../order-body/order-body.module';

import { ModalOrdersSuppliersComponent } from './modal-orders-suppliers.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    UIModule,
    SharedPipes,
    OrderBodyModule
  ],
  entryComponents: [ModalOrdersSuppliersComponent],
  exports: [ModalOrdersSuppliersComponent],
  declarations: [ModalOrdersSuppliersComponent]
})
export class ModalOrdersSuppliersModule { }
