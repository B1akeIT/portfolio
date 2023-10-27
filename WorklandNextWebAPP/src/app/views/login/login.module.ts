import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

// import { NotificationsService, SimpleNotificationsModule }	from 'angular2-notifications';

// import { CustomFormsModule } from 'ng2-validation';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    // SimpleNotificationsModule,
    // CustomFormsModule,
    LoginRoutingModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    // NotificationsService
  ]
})
export class LoginModule { }
