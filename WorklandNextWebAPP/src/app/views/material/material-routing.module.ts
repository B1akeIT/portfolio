import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialComponent } from './material.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialComponent,
    data: {
      title: 'Material'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule {}
