import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DdtComponent } from './ddt.component';

const routes: Routes = [
  {
    path: '',
    component: DdtComponent,
    data: {
      title: 'Orders'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DdtRoutingModule {}
