import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { InvoicesComponent } from './invoices.component';
import { InvoicesRoutingModule } from './invoices-routing.module';

import { InvoiceInspectorModule } from './invoice-inspector/invoice-inspector.module';
import { InvoicesFilterModule } from './invoices-filter/invoices-filter.module';
import { InvoiceEditViewModule } from './invoice-edit-view/invoice-edit-view.module';
import { ModalCopyModule } from '@app/components/modal-copy/modal-copy.module';

import { ChooseTenantCompanyModule } from '@app/components/choose-tenant-company/choose-tenant-company.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UIModule,
    SharedPipes,
    InvoicesRoutingModule,
    InvoiceInspectorModule,
    InvoicesFilterModule,
    InvoiceEditViewModule,
    ModalCopyModule,
    ChooseTenantCompanyModule
  ],
  declarations: [InvoicesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvoicesModule { }
