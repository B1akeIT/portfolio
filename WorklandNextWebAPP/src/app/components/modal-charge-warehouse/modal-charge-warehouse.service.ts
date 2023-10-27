import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ModalChargeWarehouseService extends BaseService {

  model = 'OrdineFornitoreDettaglio';

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

  save(data) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    const body: any = {
      documentoTestataId: 0,
      tipoDocumentoId: 0,
      dataCarico: '',
      causaleId: 0,
      docData: '',
      docRiferimento: 0,
      magazzinoId: 0,
      contattoId: 0
    };

    return this.http.post(`${this.apiUrl}/${this.model}/ConfermaCarico`, body, this.httpOptions);
  }
}
