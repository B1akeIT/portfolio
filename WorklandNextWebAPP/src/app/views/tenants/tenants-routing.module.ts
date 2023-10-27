import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TenantsComponent } from './tenants.component';

const routes: Routes = [
  {
    path: '',
    component: TenantsComponent,
    data: {
      title: 'Tenants'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantsRoutingModule {}
