import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { NoPermissionComponent } from './no-permission.component';

@NgModule({
  declarations: [NoPermissionComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [NoPermissionComponent]
})
export class NoPermissionModule { }
