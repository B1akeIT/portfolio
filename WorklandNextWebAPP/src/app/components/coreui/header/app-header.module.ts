import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutModule } from '../shared/layout/layout.module';
import { AppHeaderComponent } from './app-header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule
  ],
  exports: [
    AppHeaderComponent,
    LayoutModule
  ],
  declarations: [
    AppHeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppHeaderModule {}
