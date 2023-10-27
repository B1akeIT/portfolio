import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { delay } from 'rxjs/operators';

import { APP_CONST } from '../shared/const';

@Injectable({
  providedIn: 'root'
})
export class WorklandService {

  apiUrl = APP_CONST.apiUrl;
  assetUrl = APP_CONST.assetUrl;
  currentAssetUrl = APP_CONST.assetUrl;

  limit = APP_CONST.defaultPagination.limit;
  per_page = APP_CONST.defaultPagination.perPage;
  page = 1;

  language = 'it';

  q = '';

  doc_tipologie = [];

  uuid = '';

  private httpOptions = {
    headers: new HttpHeaders({}),
    params: {}
  };

  constructor(
    private http: HttpClient
  ) {}

  getAssetUrl() {
    return this.currentAssetUrl;
  }

  reset() {
    this.limit = APP_CONST.defaultPagination.limit;
    this.per_page = APP_CONST.defaultPagination.perPage;
    this.page = 1;
  }

  getUUID() {
    return this.uuid;
  }

  setUUID(uuid) {
    this.uuid = uuid;
  }

  setLimit(limit) {
    this.limit = limit;
  }

  setPerPage(per_page) {
    this.per_page = per_page;
  }

  setPage(page) {
    this.page = (page) ? page : 1;
  }

  setLanguage(language) {
    this.language = language;
  }

  // Get Json
  getJson(name) {
    return this.http.get<any>(`./assets/json/${name}.json`)
      .pipe(
        delay(1000)
      );
  }
}
