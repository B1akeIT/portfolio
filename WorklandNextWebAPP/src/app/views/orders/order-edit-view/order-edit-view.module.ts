import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { EmailsListModule } from '@app/views/contacts/emails-list/emails-list.module';
import { ModalContactModule } from '@app/components/modal-contact/modal-contact.module';
import { OrderBodyModule } from '../order-body/order-body.module';
import { OrderEditViewComponent } from './order-edit-view.component';

import { OrderQuotesModule } from '../order-quotes/order-quotes.module';
import { OrderOrdersSuppliersModule } from '../order-orders-suppliers/order-orders-suppliers.module';
import { OrderDocumentsModule } from '../order-documents/order-documents.module';
import { AdvancesModule } from '@app/components/advances/advances.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    EmailsListModule,
    ModalContactModule,
    OrderBodyModule,
    OrderQuotesModule,
    OrderOrdersSuppliersModule,
    OrderDocumentsModule,
    AdvancesModule
  ],
  declarations: [OrderEditViewComponent],
  exports: [OrderEditViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderEditViewModule { }
