import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { EmailsListModule } from '@app/views/contacts/emails-list/emails-list.module';
import { ModalContactModule } from '@app/components/modal-contact/modal-contact.module';
import { OrderSupplierBodyModule } from '../order-supplier-body/order-supplier-body.module';
import { OrderSupplierEditViewComponent } from './order-supplier-edit-view.component';

import { OrderSupplierQuotesModule } from '../order-supplier-quotes/order-supplier-quotes.module';
import { OrderSupplierOrdersModule } from '../order-supplier-orders/order-supplier-orders.module';
import { OrderSupplierDocumentsModule } from '../order-supplier-documents/order-supplier-documents.module';
// import { AdvancesModule } from '@app/components/advances/advances.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    EmailsListModule,
    ModalContactModule,
    OrderSupplierBodyModule,
    OrderSupplierQuotesModule,
    OrderSupplierOrdersModule,
    OrderSupplierDocumentsModule
  ],
  declarations: [OrderSupplierEditViewComponent],
  exports: [OrderSupplierEditViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderSupplierEditViewModule { }
