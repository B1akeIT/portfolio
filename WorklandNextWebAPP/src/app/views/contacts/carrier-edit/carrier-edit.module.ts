import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { ModalTableManagerModule } from '@app/components/modal-table-manager/modal-table-manager.module';

import { CreditCardsModule } from '../credit-cards/credit-cards.module';
import { CarrierEditComponent } from './carrier-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    ModalTableManagerModule,
    CreditCardsModule
  ],
  declarations: [CarrierEditComponent],
  exports: [CarrierEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarrierEditModule { }
