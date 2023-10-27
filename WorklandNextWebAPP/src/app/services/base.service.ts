import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from './config.service';

import { delay } from 'rxjs/operators';

import { APP_CONST } from '@app/shared/const';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  model = 'model'; // Change in the sub-class

  tenant = '';

  apiUrl = APP_CONST.apiUrl;
  assetUrl = APP_CONST.assetUrl;
  currentAssetUrl = APP_CONST.assetUrl;

  limit = APP_CONST.defaultPagination.limit;
  perPage = APP_CONST.defaultPagination.perPage;
  page = 1;
  filters: any = {};
  sortDefault = { column: 'id', direction: 'asc' };
  sort = { column: 'id', direction: 'asc' };
  distinctBy = '';

  language = 'it';

  q = '';

  ids = '';

  uuid = '';

  httpOptions = {
    headers: new HttpHeaders({}),
    params: {}
  };

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    const config = this.configService.getConfiguration();
    if (config) {
      this.apiUrl = (config.useApiTest) ? config.apiUrlTest : config.apiUrl;
      this.assetUrl = (config.useApiTest) ? config.assetUrlTest : config.assetUrl;
      this.currentAssetUrl = config.assetUrl;
    }
  }

  getAssetUrl() {
    return this.currentAssetUrl;
  }

  reset() {
    this.limit = APP_CONST.defaultPagination.limit;
    this.perPage = APP_CONST.defaultPagination.perPage;
    this.page = 1;
    this.filters = {};
    this.q = '';
    this.sort = { column: 'id', direction: 'asc' };
    this.distinctBy = '';
    this.ids = '';
  }

  getUUID() {
    return this.uuid;
  }

  setUUID(uuid) {
    this.uuid = uuid;
  }

  setTenent(tenant) {
    this.tenant = tenant;
  }

  setLimit(limit) {
    this.limit = limit;
  }

  setPerPage(perPage) {
    this.perPage = perPage;
  }

  setPage(page) {
    this.page = (page) ? page : 1;
  }

  setLanguage(language) {
    this.language = language;
  }

  setSort(column, direction) {
    this.sort.column = column;
    this.sort.direction = direction;
  }

  setFilterSearch(search) {
    this.filters.search = search;
  }

  setFilterQuery(q) {
    this.filters.q = q;
  }

  setFilterCombo(id) {
    this.filters.combo = id;
  }

  setQuery(q) {
    this.q = q;
  }

  setIds(ids) {
    this.ids = ids;
  }

  setDistinctBy(field) {
    this.distinctBy = field;
  }

  getCustom(params) {
    return this.http.get<any>(`${this.apiUrl}/${params}`);
  }

  getListChoices(type) {
    const httpParams = new HttpParams()
      .set('page', String(1))
      .set('limit', String(0))
      .set('orderBy', 'key')
      .set('sortedBy', 'asc')
      .set('search', 'context:' + type);

    this.httpOptions.params = {}; // httpParams;

    return this.http.get<any>(
      this.apiUrl + '/choices',
      this.httpOptions
    );
  }

  getModelMediums(id, type = null) {
    const verb = type ? type : 'any-mediums';
    return this.http.get<any>(`${this.apiUrl}/${this.model}/${id}/${verb}`);
  }

  // General Model

  getModel(id) {
    return this.http.get<any>(`${this.apiUrl}/${this.model}/${id}`);
  }

  getListModel() {
    let httpParams = new HttpParams()
      .set('page', String(this.page))
      .set('limit', String(this.perPage));

    if (this.sort.column) {
      httpParams = httpParams.set('orderBy', this.sort.column);
      httpParams = httpParams.set('sortedBy', this.sort.direction);
    }
    if (this.filters.q && (this.filters.q !== '')) {
      httpParams = httpParams.set('search', this.filters.q);
    }
    if (this.filters.search) {
      httpParams = httpParams.set('search', this.filters.search);
    }
    if (this.q && (this.q !== '')) {
      httpParams = httpParams.set('search', this.q);
    }
    if (this.distinctBy) {
      httpParams = httpParams.set('distinctBy', this.distinctBy);
    }

    this.httpOptions.params = {}; // httpParams;

    return this.http.get<any>(`${this.apiUrl}/${this.model}`, this.httpOptions);
  }

  saveModel(body) {
    return this.http
      .post(`${this.apiUrl}/${this.model}`, body);
  }

  updateModel(id, body) {
    return this.http
      .put(`${this.apiUrl}/${this.model}/${id}`, body);
  }

  deleteModel(id) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http
      .delete(`${this.apiUrl}/${this.model}/${id}`, this.httpOptions);
  }

  // Related Model

  getRelated(id, related) {
    const httpParams = new HttpParams()
      .set('page', String(this.page))
      .set('limit', String(this.perPage));

    this.httpOptions.params = {}; // httpParams;

    return this.http.get<any>(`${this.apiUrl}/${this.model}/${id}/${related}`, this.httpOptions);
  }

  setRelated(related, body) {
    return this.http
      .post(`${this.apiUrl}/${this.model}/set/${related}`, body);
  }

  saveRelatedModel(type, body) {
    return this.http
      .post(`${this.apiUrl}/${this.model}/create/${type}`, body);
  }

  // Attach - Detach Model

  attachRelatedToModel(related, body) {
    return this.http
      .post(`${this.apiUrl}/${this.model}/attach/${related}`, body);
  }

  detachRelatedFromModel(related, body) {
    return this.http
      .post(`${this.apiUrl}/${this.model}/detach/${related}`, body);
  }

  // Grid

  getGrid(view: string) {
    const httpParams = new HttpParams()
      .set('viewName', view);

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(
      `${this.apiUrl}/Grid/GetGridDescription`,
      this.httpOptions
    );
  }

  // Get Json

  getJson(name) {
    return this.http.get<any>(`./assets/json/${name}.json`)
      .pipe(
        delay(1000)
      );
  }
}
