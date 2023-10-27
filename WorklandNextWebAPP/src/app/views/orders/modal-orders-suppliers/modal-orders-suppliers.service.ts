import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ModalOrdersSuppliersService extends BaseService {

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
    body.parametri.aziendaId = parseInt(body.parametri.aziendaId, 10);
    body.parametri.fornitoreId = parseInt(body.parametri.fornitoreId, 10);
    body.parametri.sezionaleId = parseInt(body.parametri.sezionaleId, 10);
    body.parametri.isEscludiRigheComplete = Number(body.parametri.isEscludiRigheComplete);
    body.parametri.isEscludiRigheOrdinate = Number(body.parametri.isEscludiRigheOrdinate);
    body.parametri.isEscludiRighePreparate = Number(body.parametri.isEscludiRighePreparate);
    body.parametri.isFornitoreDaArticolo = Number(body.parametri.isFornitoreDaArticolo);

    return this.http.post(`${this.apiUrl}/${this.model}/GeneraOrdineFornitore`, body, this.httpOptions);
  }

  getDefaultValues() {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);

    let httpParams = new HttpParams();
    httpParams = httpParams.set('nomeSp', 'SpGetDefaultWizardOFdaOC');

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    const body = {};

    return this.http.post(`${this.apiUrl}/Configuration/WindowDefaultValues`, body, this.httpOptions);
  }
}
