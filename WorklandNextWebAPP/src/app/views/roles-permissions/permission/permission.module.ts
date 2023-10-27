import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { PermissionComponent } from './permission.component';

@NgModule({
  declarations: [PermissionComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [PermissionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PermissionModule { }
