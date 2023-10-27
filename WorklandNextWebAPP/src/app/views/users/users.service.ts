import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService {

  model = 'userprincipal';

  sortDefault = { column: 'userName', direction: 'asc' };

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
      httpParams = httpParams.set('OrderTerm', this.sort.column + '|' + this.sort.direction);
    }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/${this.model}`, this.httpOptions);
  }

  // User & Tenant

  attachUserTenat(userId, tenantId) {
    const body = {
      userId: userId,
      tenantId: tenantId
    };

    return this.http
      .post(`${this.apiUrl}/usertenant`, body);
  }

  detachUserTenat(userId, tenantId) {
    const body = {
      userId: userId,
      tenantId: tenantId
    };

    return this.http
      .post(`${this.apiUrl}/usertenant/${userId}`, body);
  }

  saveUser(tenant, body) {
    let resultObs = null;
    const userId = body.id;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    delete body.ruolo;

    if (userId && userId !== 0 ) {
      resultObs = this.http
        .put(`${this.apiUrl}/utente/${userId}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/utente`, body, this.httpOptions);
    }

    return resultObs;
  }

  updatePassword(userId, body) {
    return this.http
      .put(`${this.apiUrl}/userprincipal/${userId}/changepassword`, body);
  }

  updateEmail(userId, body) {
    return this.http
      .put(`${this.apiUrl}/userprincipal/${userId}/changeemail`, body);
  }

  updateRole(userId, body) {
    return this.http
      .put(`${this.apiUrl}/userprincipal/${userId}/changerole`, body);
  }

  setStateUserPrincipal(userId, active) {
    const action = active ? 'activate' : 'deactivate';
    return this.http
      .put(`${this.apiUrl}/userprincipal/${userId}/${action}`, {});
  }

  getListRolePrincipal() {
    return this.http.get<any[]>(`${this.apiUrl}/roleprincipal`);
  }

  getListRole(tenant) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.get<any[]>(`${this.apiUrl}/anagruolo`, this.httpOptions);
  }

  getAziende(tenant) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.get<any[]>(`${this.apiUrl}/Azienda`, this.httpOptions);
  }
}
