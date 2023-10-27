import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ChoiceService extends BaseService {

  model = 'contatto';

  contactType = ''; // Agente / Cliente / Fornitore / Unita

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }

  setContactType(type) {
    this.contactType = type;
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
    if (this.contactType && (this.contactType !== '')) {
      httpParams = httpParams.set('SpecializzazioneContattoType', this.contactType);
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

  getContactType(id, type) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/${type}/${this.model}/${id}`, this.httpOptions);
  }

  getContactTypeAzienda(id, type, aid) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    let url = this.apiUrl;
    switch (type) {
      case 'Cliente':
        url += `/ClienteContabilita/${id}/Azienda/${aid}`;
        break;
      case 'Fornitore':
        url += `/FornitoreContabilita/${id}/Azienda/${aid}`;
        // url += `/${type}/${this.model}/${id}`;
        break;
      case 'Unita':
        url += `/${type}/${id}`;
        break;
      case 'Agente':
        url += `/${type}/${this.model}/${id}`;
        break;
    }

    return this.http.get<any[]>(url, this.httpOptions);
  }

  getContactEmails(id, aid) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/EmailContatto/${id}/azienda/${aid}`, this.httpOptions);
  }

  getContactReferences(id) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/RiferimentoContatto/Contatto/${id}`, this.httpOptions);
  }

  getContactLocalUnits(id) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/ContattoUnitaLocale/Contatto/${id}`, this.httpOptions);
  }
}
