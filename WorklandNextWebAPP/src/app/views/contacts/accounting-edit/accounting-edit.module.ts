import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { ModalTableManagerModule } from '@app/components/modal-table-manager/modal-table-manager.module';

import { CreditCardsModule } from '../credit-cards/credit-cards.module';
import { AdvancesModule } from '@app/components/advances/advances.module';

import { AccountingEditComponent } from './accounting-edit.component'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    ModalTableManagerModule,
    CreditCardsModule,
    AdvancesModule
  ],
  declarations: [AccountingEditComponent],
  exports: [AccountingEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountingEditModule { }
