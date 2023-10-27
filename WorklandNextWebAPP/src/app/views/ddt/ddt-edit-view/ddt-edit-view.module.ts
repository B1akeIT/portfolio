import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { EmailsListModule } from '@app/views/contacts/emails-list/emails-list.module';
import { ModalContactModule } from '@app/components/modal-contact/modal-contact.module';
import { DdtBodyModule } from '../ddt-body/ddt-body.module';
import { DdtEditViewComponent } from './ddt-edit-view.component';

import { DdtQuotesModule } from '../ddt-quotes/ddt-quotes.module';
import { DdtOrdersModule } from '../ddt-orders/ddt-orders.module';
import { DdtOrdersSuppliersModule } from '../ddt-orders-suppliers/ddt-orders-suppliers.module';
import { DdtDocumentsModule } from '../ddt-documents/ddt-documents.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    EmailsListModule,
    ModalContactModule,
    DdtBodyModule,
    DdtQuotesModule,
    DdtOrdersModule,
    DdtOrdersSuppliersModule,
    DdtDocumentsModule
  ],
  declarations: [DdtEditViewComponent],
  exports: [DdtEditViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DdtEditViewModule { }
