import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesPermissionsComponent } from './roles-permissions.component';

const routes: Routes = [
  {
    path: '',
    component: RolesPermissionsComponent,
    data: {
        title: 'Roles & Permissions'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RolesPermissionsRoutingModule {}
