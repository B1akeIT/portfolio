import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class TenantsService extends BaseService {

  model = 'tenant';

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }

  getUsersTenant(tenant) {
    let headers = new HttpHeaders();
    headers = headers.set('tenant', tenant);
    this.httpOptions.headers = headers;
    this.httpOptions.params = {};

    return this.http.get<any[]>(`${this.apiUrl}/utente`, this.httpOptions);
  }
}
