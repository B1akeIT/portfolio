import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService extends BaseService {

  model = 'FatturaTestata';
  modelDettaglio = 'FatturaDettaglio';
  modelDettagliNC = 'DettagliPerNC';

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

  getListModel() {
    let httpParams = new HttpParams();

    if (this.aziendaId) {
      httpParams = httpParams.set('AziendaId', this.aziendaId);
    }
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
    if (this.dateRange.dataInizio) {
      httpParams = httpParams.set('DataInizio', this.dateRange.dataInizio);
    }
    if (this.dateRange.dataFine) {
      httpParams = httpParams.set('DataFine', this.dateRange.dataFine);
    }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/${this.model}`, this.httpOptions);
  }

  getModel(id) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/${this.model}/${id}`, this.httpOptions);
  }

  _getOrderDefaultValues(aziendaId: number, tipoDocumentoId: number) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);

    let httpParams = new HttpParams();
    httpParams = httpParams.set('nomeSp', 'SpGetDefaultFatturaTestata');

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    const body = {
      aziendaId: aziendaId,
      tipoDocumentoId: tipoDocumentoId
    };

    return this.http.post(`${this.apiUrl}/Configuration/WindowDefaultValues`, body, this.httpOptions);
  }

  saveInvoice(id, body, forceRecalculate = false) {
    let resultObs = null;

    let httpParams = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;

    httpParams = httpParams.set('RicalcolaScadenze', forceRecalculate.toString());
    this.httpOptions.params = httpParams;

    body.numero = parseInt(body.numero, 10);
    body.magazzinoId = parseInt(body.magazzinoId, 10);
    body.anagValutaId = parseInt(body.anagValutaId, 10);
    body.valutaDiRedazioneId = parseInt(body.valutaDiRedazioneId, 10) || 0;
    body.anagValutazioneId = parseInt(body.anagValutazioneId, 10);
    body.anagLinguaId = parseInt(body.anagLinguaId, 10);
    body.categoriaDocumentoId = parseInt(body.categoriaDocumentoId, 10);
    body.anagTipoClienteId = parseInt(body.anagTipoClienteId, 10);
    body.listinoId = parseInt(body.listinoId, 10);
    body.anagDepartmentId = parseInt(body.anagDepartmentId, 10);

    if (id && id !== 0 ) {
      resultObs = this.http
        .put(`${this.apiUrl}/${this.model}/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/${this.model}`, body, this.httpOptions);
    }

    return resultObs;
  }

  getInvoiceDetails(id: number) {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('ParentTestataId', String(id));

    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    let _url = `${this.apiUrl}/${this.modelDettaglio}`;

    return this.http.get<any>(_url, this.httpOptions);
  }

  getInvoiceDetailsNC(id: number, body:any) {
    let httpParams = new HttpParams();

    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    const _url = `${this.apiUrl}/${this.model}/${this.modelDettagliNC}`;
    return this.http.post<any>(_url, body, this.httpOptions);
  }

  getInvoiceItem(id) {
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.get<any>(`${this.apiUrl}/${this.modelDettaglio}/${id}`, this.httpOptions);
  }

  deleteInvoiceItem(id) {
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.delete<any>(`${this.apiUrl}/${this.modelDettaglio}/${id}`, this.httpOptions);
  }

  getArticoli(id) {
    let httpParams = new HttpParams();

    if (this.page && this.perPage) {
      httpParams = httpParams.set('PageNumber', String(this.page));
      httpParams = httpParams.set('PageSize', String(this.perPage));
    }

    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/articolo`, this.httpOptions);
  }

  // Autocomplete Articoli

  getArticoliForAutocomple(term: string = null) {
    let httpParams = new HttpParams();

    if (this.page && this.perPage) {
      httpParams = httpParams.set('PageNumber', String(this.page));
      httpParams = httpParams.set('PageSize', String(this.perPage));
    }
    if (term && (term !== '')) {
      httpParams = httpParams.set('Keyword', term);
    }

    httpParams = httpParams.set('orderTerm', 'id' + '|' + 'asc');

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/articolo`, this.httpOptions)
      .pipe(map((resp: any) => {
        if (resp.error) {
          throwError(resp.error);
        } else {
          return resp.items;
        }
      }));
  }

  saveArticolo(id, body) {
    let resultObs: Observable<Object> = null;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    body.quantita = parseFloat(body.quantita) || 0;
    body.costo = parseFloat(body.costo) || 0;
    body.prezzoTotale = parseFloat(body.prezzoTotale) || 0;
    body.prezzoUnitario = parseFloat(body.prezzoUnitario) || 0;
    body.prezzoUnitarioScontato = parseFloat(body.prezzoUnitarioScontato) || 0;
    body.margine = parseFloat(body.margine) || 0;
    body.ricaricoPercentuale = parseFloat(body.ricaricoPercentuale) || 0;
    body.totaleIva = parseFloat(body.totaleIva) || 0;
    body.totaleLordo = parseFloat(body.totaleLordo) || 0;
    body.sconto1 = parseFloat(body.sconto1) || 0;
    body.sconto2 = parseFloat(body.sconto2) || 0;

    if (id && id !== 0) {
      resultObs = this.http
        .put(`${this.apiUrl}/${this.modelDettaglio}/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/${this.modelDettaglio}`, body, this.httpOptions);
    }

    return resultObs;
  }

  // Autocomplete Contacts

  getContacts(term: string = null): Observable<any> {
    let httpParams = new HttpParams();

    if (this.page && this.perPage) {
      httpParams = httpParams.set('PageNumber', String(this.page));
      httpParams = httpParams.set('PageSize', String(this.perPage));
    }
    if (term && (term !== '')) {
      httpParams = httpParams.set('Keyword', term);
    }
    // if (this.contactType && (this.contactType !== '')) {
    //   httpParams = httpParams.set('SpecializzazioneContattoType', this.contactType);
    // }
    httpParams = httpParams.set('orderTerm', 'id' + '|' + 'asc');

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/contatto`, this.httpOptions)
      .pipe(map((resp: any) => {
        if (resp.error) {
          throwError(resp.error);
        } else {
          return resp.items;
        }
      }));
  }

  getInvoicesContact(id) {
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
    if (this.dateRange.dataInizio) {
      httpParams = httpParams.set('DataInizio', this.dateRange.dataInizio);
    }
    if (this.dateRange.dataFine) {
      httpParams = httpParams.set('DataFine', this.dateRange.dataFine);
    }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/${this.model}/contatto/${id}`, this.httpOptions);
  }

  getCastelletto(id, aziendaId) {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('ParentTestataId', String(id));
    if (aziendaId) {
      httpParams = httpParams.set('AziendaId', String(aziendaId));
    }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/CastellettoFattura`, this.httpOptions);
  }

  getScadenze(id, aziendaId) {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('ParentTestataId', String(id));
    if (aziendaId) {
      httpParams = httpParams.set('AziendaId', String(aziendaId));
    }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/ScadenzaFattura/Dettaglio`, this.httpOptions);
  }

  getOrdersInvoice(id) {
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
    if (this.dateRange.dataInizio) {
      httpParams = httpParams.set('DataInizio', this.dateRange.dataInizio);
    }
    if (this.dateRange.dataFine) {
      httpParams = httpParams.set('DataFine', this.dateRange.dataFine);
    }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/${this.model}/contatto/${id}`, this.httpOptions);
  }
}
