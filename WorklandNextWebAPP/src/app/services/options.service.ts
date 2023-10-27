import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import { APP_CONST } from '../shared/const';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  apiUrl = APP_CONST.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({}),
    params: {}
  };

  private uuid = '';
  private options = null;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {
  }

  setUUID(uuid) {
    this.uuid = uuid;
  }

  getUUID() {
    return this.uuid;
  }

  loadOptions() {
    this.options = this.getLocalOptions();
  }

  saveOptions(options) {
    const isAuth = true; // this.authenticationService.isLogged();
    if (isAuth) {
      const lStorage = this.saveLocalOptions(options);
    }
  }

  decodeDataOptions(data) {
    const decodeData = JSON.parse(decodeURI(window.atob(data)));
    return decodeData;
  }

  encodeDataOptions(data) {
    const encodeData = window.btoa(encodeURI(JSON.stringify(data)));
    return encodeData;
  }

  getLocalOptions() {
    const storage = localStorage.getItem(APP_CONST.storageOptions);
    if (storage && storage !== 'null') {
      const options = this.decodeDataOptions(storage);
      return options;
    } else {
      return this.setDefaultOptions(APP_CONST.defaultLanguage);
    }
  }

  saveLocalOptions(options) {
    const lStorage = this.encodeDataOptions(options);
    localStorage.setItem(APP_CONST.storageOptions, lStorage);
    return lStorage;
  }

  getDefaultOptions(language) {
    const options = {
      version: APP_CONST.optionsVersion,
      auto_save: true,
      language: language,
      units: APP_CONST.defaultUnits,
      notifications: true,
      contacts_default_view: 'list',
      contacts_list_show_thumb: false
    };

    return options;
  }

  setDefaultOptions(language) {
    const options = this.getDefaultOptions(language);
    this.saveOptions(options);
    console.log('options', options);
    return options;
  }

  migrateOptions() {
    let save = false;
    const defaultOptions = {
      version: APP_CONST.optionsVersion,
      auto_save: true,
      language: APP_CONST.defaultLanguage,
      units: APP_CONST.defaultUnits,
      notifications: true
    };
    let options = this.getLocalOptions();
    if (options.version) {
      switch (options.version) {
        case '0.1':
          options = defaultOptions;
          save = true;
          break;
        // tslint:disable-next-line:no-switch-case-fall-through
        case '0.2':
          options.version = APP_CONST.optionsVersion;
          options.contacts_default_view = 'list';
          options.contacts_list_show_thumb = false;
          save = true;
          break;
      }
    } else {
      options = defaultOptions;
      save = true;
    }
    if (save) {
      this.saveOptions(options);
    }
  }

  setOptions(options) {
    const curr_options = this.getLocalOptions();
    curr_options.auto_save = options.auto_save;
    curr_options.language = options.language;
    curr_options.units = options.units;
    curr_options.notifications = options.notifications;
    curr_options.country = options.country;
    curr_options.contacts_default_view = 'list';
    curr_options.contacts_list_show_thumb = false;
    this.saveOptions(curr_options);
    this.translate.use(curr_options.language);
  }

  setLanguage(language) {
    const options = this.getLocalOptions();
    options.language = language;
    this.saveOptions(options);
    this.translate.use(options.language);
  }

  getLanguage() {
    const options = this.getLocalOptions();
    return options.language;
  }

  setUnits(units) {
    const options = this.getLocalOptions();
    options.units = units;
    this.saveOptions(options);
  }

  setNotificationsNews(flag) {
    const options = this.getLocalOptions();
    options.notifications = flag;
    this.saveOptions(options);
  }
}
