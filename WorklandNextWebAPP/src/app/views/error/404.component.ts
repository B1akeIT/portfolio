import { Component } from '@angular/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  templateUrl: '404.component.html'
})
export class P404Component {

  options: AnimationOptions = {
    path: '/assets/animations/erro-404.json',
  };

  constructor() { }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }
}
