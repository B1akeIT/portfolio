import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ModalCreateOrderService extends BaseService {

  model = '';

  sortDefault = { column: 'id', direction: 'asc' };

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }

  setModel(model) {
    this.model = model;
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

  create(body) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    delete body.item;
    body.parametri.sezionaleId = parseInt(body.parametri.sezionaleId, 10);
    body.parametri.numDocumento = parseInt(body.parametri.numDocumento, 10);
    body.parametri.aziendaId = parseInt(body.parametri.aziendaId, 10);
    body.parametri.tassoDiConversione = parseFloat(body.parametri.tassoDiConversione);

    return this.http.post(`${this.apiUrl}/${this.model}/GeneraOrdineCliente`, body, this.httpOptions);
  }

  getDefaultValues() {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);

    let httpParams = new HttpParams();
    httpParams = httpParams.set('nomeSp', 'SpGetDefaultWizardOCDaPrev');

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    const body = {};

    return this.http.post(`${this.apiUrl}/Configuration/WindowDefaultValues`, body, this.httpOptions);
  }
}
