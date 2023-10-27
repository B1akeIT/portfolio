import { NgModule } from '@angular/core';

import { NgSplitPipeModule } from 'angular-pipes';
import { NgArrayPipesModule } from 'ngx-pipes';

import { OrderByPipe } from '../pipes/ordeby.pipe';

@NgModule({
  imports: [],
  declarations: [
    OrderByPipe
  ],
  exports: [
    NgArrayPipesModule,
    // NgStringPipesModule,
    NgSplitPipeModule,
    OrderByPipe
  ]
})
export class SharedPipes {}
