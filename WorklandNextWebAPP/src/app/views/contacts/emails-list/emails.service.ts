import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class EmailsService extends BaseService {

  model = 'EmailContatto';

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }

  getListModel() {
    let httpParams = new HttpParams();

    if (this.page && this.perPage) {
      httpParams = httpParams.set('PageNumber', String(this.page));
      httpParams = httpParams.set('PageSize', String(this.perPage));
    }
    if (this.q && (this.q !== '')) {
      httpParams = httpParams.set('Keyword', this.q);
    }
    if (this.sort.column) {
      httpParams = httpParams.set('orderTerm', this.sort.column + '|' + this.sort.direction);
    }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/${this.model}`, this.httpOptions);
  }

  getModel(id) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/${this.model}/${id}`, this.httpOptions);
  }

  saveModel(body) {
    let resultObs = null;
    const emailId = body.id;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    delete body.descrizioneMail;

    if (emailId && emailId !== 0 ) {
      resultObs = this.http
        .put(`${this.apiUrl}/${this.model}/${emailId}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/${this.model}`, body, this.httpOptions);
    }

    return resultObs;
  }

  deleteModel(id) {
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.delete(`${this.apiUrl}/${this.model}/${id}`, this.httpOptions);
  }
}
