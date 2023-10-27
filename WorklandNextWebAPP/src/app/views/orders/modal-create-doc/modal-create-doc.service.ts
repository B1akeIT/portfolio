import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ModalCreateDocService extends BaseService {

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
    body.parametri.tipoDocumentoId = parseInt(body.parametri.tipoDocumentoId, 10);
    body.parametri.sezionaleId = parseInt(body.parametri.sezionaleId, 10);
    body.parametri.magazzinoId = parseInt(body.parametri.magazzinoId, 10);
    body.parametri.anagValutaId = parseInt(body.parametri.anagValutaId, 10);
    body.parametri.anagIvaId = parseInt(body.parametri.anagIvaId, 10);
    body.parametri.anagTrasportoACuraDelId = parseInt(body.parametri.anagTrasportoACuraDelId, 10);
    body.parametri.anagPortoId = parseInt(body.parametri.anagPortoId, 10);
    body.parametri.vettoreId = parseInt(body.parametri.vettoreId, 10);
    body.parametri.numDocumento = parseInt(body.parametri.numDocumento, 10);
    body.parametri.cambio = parseFloat(body.parametri.cambio);

    return this.http.post(`${this.apiUrl}/${this.model}/GeneraDocumentoDiEvasione`, body, this.httpOptions);
  }

  getDefaultValues(tipoDocumentoId: number) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);

    let httpParams = new HttpParams();
    httpParams = httpParams.set('nomeSp', 'SpGetDefaultWizardEvasione');

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    const body = {
      TipoDocumentoId: tipoDocumentoId
    };

    return this.http.post(`${this.apiUrl}/Configuration/WindowDefaultValues`, body, this.httpOptions);
  }
}
