import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class UnitaService extends BaseService {

  model = 'unita';

  sortDefault = { column: 'ragioneSociale', direction: 'asc' };

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }

  saveUnita(body: any, trasform: boolean = false) {
    const id = body.id;
    let resultObs = null;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    delete body.shipType;
    delete body.shipyard;
    delete body.proprietario;

    body.anagShipTypeId = parseInt(body.anagShipTypeId, 10);
    body.anagShipyardId = parseInt(body.anagShipyardId, 10);
    // body.imoNumber = parseInt(body.imoNumber, 10);
    // body.grossTonnage = parseFloat(body.grossTonnage);
    // body.lenght = parseFloat(body.lenght);

    if (id && id !== 0) {
      delete body.contatto;

      resultObs = this.http
        .put(`${this.apiUrl}/Unita/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      const _trasfom = trasform ? '/Trasforma' : '';
      resultObs = this.http
        .post(`${this.apiUrl}/Unita${_trasfom}`, body, this.httpOptions);
    }

    return resultObs;
  }

  collega(id: any, clientId: any) {
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    const body = {
      unitaId: id,
      clienteId: clientId
    };

    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.put(`${this.apiUrl}/${this.model}/Collega`, body, this.httpOptions);
  }

  scollega(id: any, clientId: any) {
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    const body = {
      unitaId: id,
      clienteId: clientId
    };

    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.put(`${this.apiUrl}/${this.model}/Scollega`, body, this.httpOptions);
  }

}
