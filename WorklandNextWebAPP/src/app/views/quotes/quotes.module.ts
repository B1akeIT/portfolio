import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { UIModule } from '@app/shared/ui.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { QuotesComponent } from './quotes.component';
import { QuotesRoutingModule } from './quotes-routing.module';

import { QuoteInspectorModule } from './quote-inspector/quote-inspector.module';
import { QuotesFilterModule } from './quotes-filter/quotes-filter.module';
import { QuoteEditViewModule } from './quote-edit-view/quote-edit-view.module';
import { ModalCreateOrderModule } from './modal-create-order/modal-create-order.module';
import { ModalCopyModule } from '@app/components/modal-copy/modal-copy.module';

import { ChooseTenantCompanyModule } from '@app/components/choose-tenant-company/choose-tenant-company.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UIModule,
    SharedPipes,
    QuotesRoutingModule,
    QuoteInspectorModule,
    QuotesFilterModule,
    QuoteEditViewModule,
    ModalCreateOrderModule,
    ModalCopyModule,
    ChooseTenantCompanyModule
  ],
  declarations: [QuotesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuotesModule { }
