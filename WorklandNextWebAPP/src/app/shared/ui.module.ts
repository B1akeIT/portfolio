import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoPermissionModule } from '@app/components/no-permission';

import { HasPermissionDirective } from '@app/directives';
import { HasRoleDirective } from '@app/directives';
import { TrimInputDirective } from '@app/directives';

const UI_DIRECTIVES = [
  HasPermissionDirective,
  HasRoleDirective
];

// @dynamic
@NgModule({
  imports: [
    CommonModule,
    NoPermissionModule
  ],
  declarations: [
    HasPermissionDirective,
    HasRoleDirective,
    TrimInputDirective
  ],
  providers: [
  ],
  exports: [
    CommonModule,
    NoPermissionModule,
    HasPermissionDirective,
    HasRoleDirective,
    TrimInputDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UIModule { }
