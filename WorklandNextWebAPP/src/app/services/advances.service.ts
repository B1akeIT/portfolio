import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class AdvancesService extends BaseService {

  model = 'Anticipo';

  aziendaId = null;

  sortDefault = { column: 'numero', direction: 'asc' };

  dateRange = { dataInizio: null, dataFine: null };

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }

  setAziendaId(aId) {
    this.aziendaId = aId;
  }

  setDateRange(data) {
    this.dateRange = { ...data };
  }

  // Advances

  getAdvances(clientId: number, documentId: number, tipoDocumentoId: number, aziendaId: number) {
    let httpParams = new HttpParams();

    if (clientId) {
      httpParams = httpParams.set('ParentId', String(clientId));
    }
    if (documentId) {
      httpParams = httpParams.set('DocumentoId', String(documentId));
    }
    if (tipoDocumentoId) {
      httpParams = httpParams.set('TipoDocumentoId', String(tipoDocumentoId));
    }
    if (aziendaId) {
      httpParams = httpParams.set('AziendaId', String(aziendaId));
    }

    if (this.page && this.perPage) {
      httpParams = httpParams.set('PageNumber', String(1));
      httpParams = httpParams.set('PageSize', String(1000));
    }

    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/Anticipo`, this.httpOptions);
  }

  getAdvance(id) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/${this.model}/${id}`, this.httpOptions);
  }

  saveAdvance(id, body) {
    let resultObs: Observable<Object> = null;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    if (id && id !== 0) {
      resultObs = this.http
        .put(`${this.apiUrl}/${this.model}/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/${this.model}`, body, this.httpOptions);
    }

    return resultObs;
  }

  deleteAdvance(id: any): Observable<Object> {
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.delete(`${this.apiUrl}/${this.model}/${id}`, this.httpOptions);
  }
}
