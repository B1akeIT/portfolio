import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { registerLocaleData } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import localeEn from '@angular/common/locales/en-GB';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localeIt from '@angular/common/locales/it';

import { APP_CONST } from './shared/const';

import * as moment from 'moment';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private translate: TranslateService,
    private localeService: BsLocaleService
  ) {
    registerLocaleData(localeEn, 'en');
    registerLocaleData(localeFr, 'fr');
    registerLocaleData(localeEs, 'es');
    registerLocaleData(localeIt, 'it');

    /* Lang */
    const defaultLanguage = APP_CONST.defaultLanguage;
    this.translate.addLangs(APP_CONST.languages);
    this.translate.setDefaultLang(defaultLanguage);
    const browserLang = translate.getBrowserLang();
    // defaultLanguage = browserLang.match(/en|it/) ? browserLang : 'it';

    this.translate.use(defaultLanguage);
    moment.locale(defaultLanguage);
    this.localeService.use(defaultLanguage);

    console.group('APP ENVIRONMENT');
    console.log('App Production', APP_CONST.production);
    console.log('Version', APP_CONST.appVersion);
    if (!APP_CONST.production) {
      console.log('Versions', APP_CONST.versions);
    }
    // console.log('apiURL', APP_CONST.apiUrl);
    // console.log('assetUrl', APP_CONST.assetUrl);
    console.log('Language', defaultLanguage);
    console.log('href', window.location.href);
    console.log('host', window.location.host);
    console.groupEnd();
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
