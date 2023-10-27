import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { EmailsListModule } from '@app/views/contacts/emails-list/emails-list.module';
import { ModalContactModule } from '@app/components/modal-contact/modal-contact.module';
import { QuoteBodyModule } from '../quote-body/quote-body.module';
import { ModalCreateOrderModule } from '../modal-create-order/modal-create-order.module';
import { ModalCopyModule } from '@app/components/modal-copy/modal-copy.module';
import { QuoteEditViewComponent } from './quote-edit-view.component';

import { QuoteOrdersModule } from '../quote-orders/quote-orders.module';
import { QuoteOrdersSuppliersModule } from '../quote-orders-suppliers/quote-orders-suppliers.module';
import { QuoteDocumentsModule } from '../quote-documents/quote-documents.module';
import { AdvancesModule } from '@app/components/advances/advances.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    EmailsListModule,
    ModalContactModule,
    QuoteBodyModule,
    ModalCreateOrderModule,
    ModalCopyModule,
    QuoteOrdersModule,
    QuoteOrdersSuppliersModule,
    QuoteDocumentsModule,
    AdvancesModule
  ],
  declarations: [QuoteEditViewComponent],
  exports: [QuoteEditViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuoteEditViewModule { }
