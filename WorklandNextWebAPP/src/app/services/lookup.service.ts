import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ConfigService } from '@app/services/config.service';
import { BaseService } from '@app/services/base.service';

import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class LookupService extends BaseService {

  model = '';

  sortDefault = { column: 'id', direction: 'asc' };

  dateRange = { dataInizio: null, dataFine: null };

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(http, configService);
  }

  setDateRange(data) {
    this.dateRange = { ...data };
  }

  getListCombo(nomeSp, item) {
    // /Grid/ExecuteComboSp?nomeSp=SpComboArticoloLookUp&Keyword=&PageNumber=1&PageSize=100&Param={"Param1":value1,"Param2":value2}
    const url = 'Grid/ExecuteComboSp';

    let httpParams = new HttpParams();

    httpParams = httpParams.set('nomeSp', nomeSp);
    if (item) {
      httpParams = httpParams.set('Param', JSON.stringify(item));
      httpParams = httpParams.set('AziendaId', item.AziendaId);
    }

    if (this.page && this.perPage) {
      httpParams = httpParams.set('PageNumber', String(this.page));
      httpParams = httpParams.set('PageSize', String(this.perPage));
    }
    if (this.q && (this.q !== '')) {
      httpParams = httpParams.set('Keyword', this.q);
    }
    // if (this.sort.column) {
    //   httpParams = httpParams.set('OrderTerm', this.sort.column + '|' + this.sort.direction);
    // }
    // if (this.dateRange.dataInizio) {
    //   httpParams = httpParams.set('DataInizio', this.dateRange.dataInizio);
    // }
    // if (this.dateRange.dataFine) {
    //   httpParams = httpParams.set('DataFine', this.dateRange.dataFine);
    // }

    let headers = new HttpHeaders();
    if (this.tenant) {
      headers = headers.set('tenant', this.tenant);
    }

    this.httpOptions.headers = headers;
    this.httpOptions.params = httpParams;

    return this.http.get<any[]>(`${this.apiUrl}/${url}`, this.httpOptions)
      .pipe(
        map((response: any) => {
          const data = JSON.parse(response.jsonResult);
          const schemaDescription = JSON.parse(response.schemaDescription);
          const ColumnSchemas = JSON.parse(schemaDescription[0].ColumnSchemas);

          const _isEmpty = (data[nomeSp][0] && data[nomeSp][0].Id === 0) ? true : false;
          response.items = _isEmpty ? [] : data[nomeSp];
          response.schema = ColumnSchemas;

          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
}
