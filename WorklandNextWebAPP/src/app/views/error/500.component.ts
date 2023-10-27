import { Component } from '@angular/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  templateUrl: '500.component.html'
})
export class P500Component {

  options: AnimationOptions = {
    path: '/assets/animations/login.json',
  };

  constructor() { }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }
}
