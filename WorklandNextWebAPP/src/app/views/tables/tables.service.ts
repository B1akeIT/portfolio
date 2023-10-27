import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TablesService extends BaseService {

  model = 'tables';

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }

  getTables() {
    return this.http.get<any>(`./assets/config/tables.json`);
  }

  getTable(table, companyId = null, paged: boolean = true, abiId = null) {
    let httpParams = new HttpParams();

    if (abiId) {
      httpParams = httpParams.set('AnagAbiId', String(abiId));
    }
    if (companyId) {
      httpParams = httpParams.set('aziendaId', String(companyId));
    }
    if (paged) { // && this.page && this.perPage
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

    if (paged) {
      this.httpOptions.params = httpParams;
    }

    return this.http.get<any[]>(`${this.apiUrl}/${table}`, this.httpOptions);
  }

  getTableId(table, id) {
    const httpParams = new HttpParams();

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/${table}/${id}`, this.httpOptions);
  }

  getTableByTable(table, byTable, id, paged: boolean = true) {
    let httpParams = new HttpParams();

    if (paged) { // && this.page && this.perPage
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

    if (paged) {
      this.httpOptions.params = httpParams;
    }

    return this.http.get<any[]>(`${this.apiUrl}/${table}/${byTable}/${id}`, this.httpOptions);
  }

  updateTable(table, id, body) {
    const httpParams = new HttpParams();

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http
      .put(`${this.apiUrl}/${table}/${id}`, body, this.httpOptions);
  }

  saveTable(table, body) {
    const httpParams = new HttpParams();

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http
      .post(`${this.apiUrl}/${table}`, body, this.httpOptions);
  }

  getAziende() {
    let httpParams = new HttpParams();

    if (this.page && this.perPage) {
      httpParams = httpParams.set('PageNumber', String(this.page))
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

    return this.http.get<any[]>(`${this.apiUrl}/Azienda`, this.httpOptions);
  }

  getMagazziniAzienda(aziendaId) {
    let httpParams = new HttpParams();

    if (this.sort.column) {
      httpParams = httpParams.set('OrderTerm', this.sort.column + '|' + this.sort.direction);
    }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/Magazzino/azienda/${aziendaId}`, this.httpOptions);
  }

  getListini() {
    let httpParams = new HttpParams();

    if (this.sort.column) {
      httpParams = httpParams.set('OrderTerm', this.sort.column + '|' + this.sort.direction);
    }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/Listino`, this.httpOptions);
  }

  // Combo

  getTableCombo(nomeSp, aziendaId = null, param = null) {
    const url = 'Grid';

    let httpParams = new HttpParams();

    httpParams = httpParams.set('nomeSp', nomeSp);
    if (aziendaId) { httpParams = httpParams.set('AziendaId', aziendaId); }

    if (this.page && this.perPage) {
      httpParams = httpParams.set('PageNumber', String(this.page));
      httpParams = httpParams.set('PageSize', String(this.perPage));
    }
    if (this.q && (this.q !== '')) {
      httpParams = httpParams.set('Keyword', this.q);
    }
    if (param) {
      httpParams = httpParams.set('param', param);
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

    return this.http.get<any[]>(`${this.apiUrl}/${url}`, this.httpOptions)
      .pipe(
        map((response: any) => {
          response.items = response[nomeSp];
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
}
