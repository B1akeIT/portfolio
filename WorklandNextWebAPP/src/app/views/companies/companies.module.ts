import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { SharedPipes } from '@app/shared/shared.pipes';

import { CompaniesComponent } from './companies.component';
import { CompaniesRoutingModule } from './companies-routing.module';

import { CompanyInspectorModule } from './company-inspector/company-inspector.module';
import { CompaniesFilterModule } from './companies-filter/companies-filter.module';
import { CompaniesSortingModule } from './companies-sorting/companies-sorting.module';
import { CompanyEditViewModule } from './company-edit-view/company-edit-view.module';
import { ChooseTenantModule } from '@app/components/choose-tenant/choose-tenant.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    SharedPipes,
    CompaniesRoutingModule,
    CompanyInspectorModule,
    CompaniesFilterModule,
    CompaniesSortingModule,
    CompanyEditViewModule,
    ChooseTenantModule
  ],
  declarations: [CompaniesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CompaniesModule { }
