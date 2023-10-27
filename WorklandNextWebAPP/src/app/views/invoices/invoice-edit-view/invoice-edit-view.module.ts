import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { EmailsListModule } from '@app/views/contacts/emails-list/emails-list.module';
import { ModalContactModule } from '@app/components/modal-contact/modal-contact.module';
import { InvoiceBodyModule } from '../invoice-body/invoice-body.module';
import { InvoiceEditViewComponent } from './invoice-edit-view.component';
import { CastellettoModule } from '../castelletto/castelletto.module';
import { ScadenzeModule } from '../scadenze/scadenze.module';
import { ModalConfirmModule } from '@app/components/modal-confirm/modal-confirm.module';
import { AdvancesModule } from '@app/components/advances/advances.module';
import { ModalGeneraNcModule } from '../modal-genera-nc/modal-genera-nc.module';

import { InvoiceQuotesModule } from '../invoice-quotes/invoice-quotes.module';
import { InvoiceOrdersModule } from '../invoice-orders/invoice-orders.module';
import { InvoiceOrdersSuppliersModule } from '../invoice-orders-suppliers/invoice-orders-suppliers.module';
import { InvoiceDdtsModule } from '../invoice-ddts/invoice-ddts.module';
// import { InvoiceWarehouseMovementsModule } from '../invoice-warehouse-movements/invoice-warehouse-movements.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    EmailsListModule,
    ModalContactModule,
    InvoiceBodyModule,
    CastellettoModule,
    ScadenzeModule,
    InvoiceQuotesModule,
    InvoiceOrdersModule,
    InvoiceOrdersSuppliersModule,
    InvoiceDdtsModule,
    ModalConfirmModule,
    AdvancesModule,
    ModalGeneraNcModule
  ],
  declarations: [InvoiceEditViewComponent],
  exports: [InvoiceEditViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoiceEditViewModule { }
