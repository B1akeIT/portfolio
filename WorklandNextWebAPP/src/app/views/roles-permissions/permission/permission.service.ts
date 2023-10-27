import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseService {

  model = 'permesso';

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }

  getPermission(id) {
    const httpParams = new HttpParams();

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/${this.model}/${id}`, this.httpOptions);
  }

  savePermission(body) {
    const httpParams = new HttpParams();

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http
      .post(`${this.apiUrl}/${this.model}`, body, this.httpOptions);
  }

  updatePermission(id, body) {
    const httpParams = new HttpParams();

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http
      .put(`${this.apiUrl}/${this.model}/${id}`, body, this.httpOptions);
  }
}
