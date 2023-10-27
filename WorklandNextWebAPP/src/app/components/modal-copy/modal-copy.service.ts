import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ModalCopyService extends BaseService {

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

  copy(data) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    const body: any = {
      sostituisciTestata: data.sostituisciTestata,
      sostituisciPagamento: data.sostituisciPagamento,
      copiaAllegati: data.copiaAllegati,
      selectedAziendaId: data.selectedAziendaId,
      numeroDocumento: data.numeroDocumento,
      dataCreazione: data.dataCreazione,
      selectedSezionaleId: data.selectedSezionaleId,
      selectedTipoDocumentoId: data.selectedTipoDocumentoId
    };

    body.testata = data.item;

    return this.http.post(`${this.apiUrl}/${this.model}/Copia`, body, this.httpOptions);
  }
}
