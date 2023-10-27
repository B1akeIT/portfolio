import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends BaseService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }
}
