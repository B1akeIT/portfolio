import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';
// import { ModalTableManagerModule } from '@app/components/modal-table-manager/modal-table-manager.module';

import { AccountingDataModule } from '../accounting-data/accounting-data.module';
import { AccountingEditModule } from '../accounting-edit/accounting-edit.module';
import { ClientSupplierModule } from '../client-supplier/client-supplier.module';
import { UnitaListModule } from '../unita-list/unita-list.module';
import { EmailsListModule } from '../emails-list/emails-list.module';
import { EmailsGridListModule } from '../emails-grid-list/emails-grid-list.module';
import { ReferencessListModule } from '../references-list/references-list.module';
import { LocalUnitListModule } from '../local-units-list/local-units-list.module';
import { UnitaEditModule } from '../unita-edit/unita-edit.module';
import { CarrierModule } from '../carrier/carrier.module';
import { ContactQuotesModule } from '../contact-quotes/contact-quotes.module';
import { ContactOrdersModule } from '../contact-orders/contact-orders.module';
import { ContactOrdersSuppliersModule } from '../contact-orders-suppliers/contact-orders-suppliers.module';
import { ContactDdtModule } from '../contact-ddt/contact-ddt.module';
import { ContactInvoicesModule } from '../contact-invoices/contact-invoices.module';
import { ContactActivitiesModule } from '../contact-activities/contact-activities.module';

import { ContactEditViewComponent } from './contact-edit-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UIModule,
    SharedPipes,
    // ModalTableManagerModule,
    AccountingDataModule,
    AccountingEditModule,
    ClientSupplierModule,
    UnitaListModule,
    EmailsListModule,
    EmailsGridListModule,
    ReferencessListModule,
    LocalUnitListModule,
    UnitaEditModule,
    CarrierModule,
    ContactQuotesModule,
    ContactOrdersModule,
    ContactOrdersSuppliersModule,
    ContactDdtModule,
    ContactInvoicesModule,
    ContactActivitiesModule
  ],
  declarations: [ContactEditViewComponent],
  exports: [ContactEditViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactEditViewModule { }
