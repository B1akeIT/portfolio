import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { UserPasswordComponent } from './user-password.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [UserPasswordComponent],
  exports: [UserPasswordComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserPasswordModule { }
