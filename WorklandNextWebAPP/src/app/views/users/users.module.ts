import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';

import { UserInspectorModule } from './user-inspector/user-inspector.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UsersRoutingModule,
    UserInspectorModule
  ],
  declarations: [UsersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule { }
