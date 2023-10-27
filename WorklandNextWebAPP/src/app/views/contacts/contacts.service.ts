import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends BaseService {

  model = 'contatto';

  contactType = ''; // Agente / Cliente / Fornitore / Unita

  sortDefault = { column: 'ragioneSociale', direction: 'asc' };

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

  getContactType(id, type) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/${type}/${this.model}/${id}`, this.httpOptions);
  }

  getClientUnits(id) {
    const httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/Unita/Cliente/${id}`, this.httpOptions);
  }

  getContactTypeAzienda(id, type, aid) {
    let httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    let url = this.apiUrl;
    switch (type) {
      case 'Cliente':
        httpParams = httpParams.set('ParentId', id);
        httpParams = httpParams.set('AziendaId', aid);
        url += `/ClienteContabilita`;
        break;
      case 'Fornitore':
        httpParams = httpParams.set('ParentId', id);
        httpParams = httpParams.set('AziendaId', aid);
        url += `/FornitoreContabilita`;
        break;
      case 'Unita':
        url += `/Unita/${id}`;
        break;
      case 'Agente':
        url += `/Agente/${this.model}/${id}`;
        break;
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(url, this.httpOptions);
  }

  getContactCarrier(id, aziendaId = null) {
    let httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (aziendaId) {
      httpParams = httpParams.set('parentId', String(id));
    }

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/Vettore/Contatto/${id}`, this.httpOptions);
  }

  getContactCarrierAz(id, aziendaId = null) {
    let httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (aziendaId) {
      httpParams = httpParams.set('parentId', String(id));
      httpParams = httpParams.set('aziendaId', String(aziendaId));
    }

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/Vettore/Azienda`, this.httpOptions);
  }

  saveContact(id, body) {
    let resultObs = null;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    delete body.aziendaInserimento;
    delete body.datiUnita;
    delete body.lingua;
    delete body.nazione;
    delete body.origineContatto;
    delete body.tipoContattoList;
    delete body.valuta;
    delete body.valutazione;

    body.anagValutaId = parseInt(body.anagValutaId, 10);
    body.anagNazioneId = parseInt(body.anagNazioneId, 10);
    body.anagValutazioneId = parseInt(body.anagValutazioneId, 10);
    body.anagLinguaId = parseInt(body.anagLinguaId, 10);
    body.anagAbiId = parseInt(body.anagAbiId, 10);
    body.anagCabId = parseInt(body.anagCabId, 10);
    body.anagOrigineContattoId = parseInt(body.anagOrigineContattoId, 10);
    body.dichIntImporto = parseFloat(body.dichIntImporto);
    body.dichIntEsposizione = parseFloat(body.dichIntEsposizione);
    body.importoFido = parseFloat(body.importoFido);
    body.speseIncasso = parseFloat(body.speseIncasso);

    if (id && id !== 0 ) {
      resultObs = this.http
        .put(`${this.apiUrl}/contatto/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/contatto`, body, this.httpOptions);
    }

    return resultObs;
  }

  getContactEmails(id, aid) {
    let httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    httpParams = httpParams.set('ParentId', id);
    httpParams = httpParams.set('AziendaId', aid);

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/EmailContatto`, this.httpOptions);
  }

  getContactReferences(id) {
    let httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    httpParams = httpParams.set('ParentId', id);

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/RiferimentoContatto`, this.httpOptions);
  }

  getContactLocalUnits(id) {
    let httpParams = new HttpParams();
    let headers = new HttpHeaders();

    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    httpParams = httpParams.set('ParentId', id);

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any>(`${this.apiUrl}/ContattoUnitaLocale`, this.httpOptions);
  }

  saveClient(body) {
    const id = body.id;
    let resultObs = null;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    delete body.aziendeContabilitaList;
    delete body.tipoCliente;
    delete body.unitaList;
    body.dataInizioImportazioneTemp = body.dataInizioImportazioneTemp === '' ? null : body.dataInizioImportazioneTemp;
    body.dataFineImportazioneTemp = body.dataFineImportazioneTemp === '' ? null : body.dataFineImportazioneTemp;

    if (id && id !== 0) {
      resultObs = this.http
        .put(`${this.apiUrl}/Cliente/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/Cliente`, body, this.httpOptions);
    }

    return resultObs;
  }

  deleteClient(id) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.delete<any>(`${this.apiUrl}/Cliente/${id}`, this.httpOptions);
  }

  saveFornitore(body) {
    const id = body.id;
    let resultObs = null;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    if (id && id !== 0) {
      resultObs = this.http
        .put(`${this.apiUrl}/Fornitore/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/Fornitore`, body, this.httpOptions);
    }

    return resultObs;
  }

  deleteFornitore(id) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.delete<any>(`${this.apiUrl}/Fornitore/${id}`, this.httpOptions);
  }

  saveClientContabilita(body) {
    const id = body.id;
    let resultObs = null;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    delete body.abi;
    delete body.cab;
    delete body.clienteContabilitaCCList;
    delete body.iva;
    delete body.modalitaPagamento;
    delete body.porto;
    delete body.tipoPagamento;
    delete body.azienda;
    body.dataUltimoAggiornamentoFido = body.dataUltimoAggiornamentoFido === '' ? null : body.dataUltimoAggiornamentoFido;
    body.dataInizioInt = body.dataInizioInt === '' ? null : body.dataInizioInt;

    body.listinoId = parseInt(body.listinoId, 10);
    body.anagIVAId = parseInt(body.anagIVAId, 10);
    body.anagTipoPagamentoId = parseInt(body.anagTipoPagamentoId, 10);
    body.anagModalitaPagamentoId = parseInt(body.anagModalitaPagamentoId, 10);
    body.anagAbiId = parseInt(body.anagAbiId, 10);
    body.anagCabId = parseInt(body.anagCabId, 10);
    body.anagPortoId = parseInt(body.anagPortoId, 10);
    body.dichIntEsposizione = parseFloat(body.dichIntEsposizione);
    body.dichIntImporto = parseFloat(body.dichIntImporto);
    body.importoFido = parseFloat(body.importoFido);
    body.speseIncasso = parseFloat(body.speseIncasso);

    if (id && id !== 0) {
      resultObs = this.http
        .put(`${this.apiUrl}/ClienteContabilita/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/ClienteContabilita`, body, this.httpOptions);
    }

    return resultObs;
  }

  deleteClientContabilita(id) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.delete<any>(`${this.apiUrl}/ClienteContabilita/${id}`, this.httpOptions);
  }

  saveSupplierContabilita(body) {
    const id = body.id;
    let resultObs = null;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    delete body.iva;
    delete body.azienda;

    body.anagIVAId = parseInt(body.anagIVAId, 10);
    body.dichIntEsposizione = parseFloat(body.dichIntEsposizione);
    body.dichIntImporto = parseFloat(body.dichIntImporto);
    body.importoFido = parseFloat(body.importoFido);
    body.dataInizioInt = body.dataInizioInt === '' ? null : body.dataInizioInt;
    body.dataUltimoAggiornamentoFido = body.dataUltimoAggiornamentoFido === '' ? null : body.dataUltimoAggiornamentoFido;

    if (id && id !== 0) {
      resultObs = this.http
        .put(`${this.apiUrl}/FornitoreContabilita/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/FornitoreContabilita`, body, this.httpOptions);
    }

    return resultObs;
  }

  deleteFornitoreContabilita(id) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.delete<any>(`${this.apiUrl}/FornitoreContabilita/${id}`, this.httpOptions);
  }

  saveCarrier(body) {
    const id = body.id;
    let resultObs = null;

    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    delete body.contatto;
    delete body.azienda;
    delete body.aziendeList;

    if (id && id !== 0) {
      resultObs = this.http
        .put(`${this.apiUrl}/Vettore/${id}`, body, this.httpOptions);
    } else {
      delete body.id;
      resultObs = this.http
        .post(`${this.apiUrl}/Vettore`, body, this.httpOptions);
    }

    return resultObs;
  }

  deleteCarrier(id) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.delete<any>(`${this.apiUrl}/Vettore/${id}`, this.httpOptions);
  }

  deleteUnita(id) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', this.tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.delete<any>(`${this.apiUrl}/Unita/${id}`, this.httpOptions);
  }
}
