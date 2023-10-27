import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

  private config: any;

  constructor(private http: HttpClient) {}

  load(url: string) {
    return new Promise<void>((resolve) => {
      this.http.get(url)
        .subscribe(config => {
          this.config = config;
          resolve();
        });
      });
  }

  getConfiguration() {
    return this.config;
  }
}
