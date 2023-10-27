import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { OptionsService } from './options.service';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor(
    private http: HttpClient,
    private optionsService: OptionsService
  ) {
  }

  getHelp(help) {
    const language = this.optionsService.getLanguage();

    return this.http.get<any>(`./assets/help/${help}.${language}.json`)
      .pipe(map((data: any) => {
        // help data
      }));
  }
}
