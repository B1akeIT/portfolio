import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { AuthenticationService } from '@app/services/authentication.service';
import { ConfigService } from '@app/services/config.service';

import { APP_CONST } from '../../shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  model: any = { username: '', password: '' };
  loading = false;
  returnUrl: string;
  error = null;
  errorCode = '';

  signup_disabled = true;

  notification_options = APP_CONST.notification_options;

  options: AnimationOptions = {
    path: '/assets/animations/login.json',
  };

  config: any;

  version = APP_CONST.appVersion;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private configService: ConfigService
  ) {
    this.config = this.configService.getConfiguration();

    this.notification_options.timeOut = 3000;
  }

  ngOnInit() {
    this.authenticationService.setConfig(this.config);
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login({ value, valid }: { value: any, valid: boolean }) {
    const $this = this;
    if (valid) {
      $this.loading = true;
      $this.authenticationService.login(value.username, value.password)
        .subscribe(
          (response: any) => {
            if (!$this.returnUrl || $this.returnUrl === '/') {
              $this.returnUrl = '/dashboard';
            }
            $this.router.navigate([$this.returnUrl]);
            $this.loading = false;
          },
          error => {
            $this.error = error;
            $this.errorCode = error.error.status;
            console.log('error', $this.errorCode, error);
            $this.loading = false;
          }
        );
    }
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }
}
