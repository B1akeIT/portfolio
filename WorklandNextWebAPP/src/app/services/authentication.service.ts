import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import { OptionsService } from '@app/services/options.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';

import { ConfigService } from './config.service';

import { map } from 'rxjs/operators';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiUrl = APP_CONST.apiUrl;

  config: any = null;

  private currentSession = null;
  private user = null;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private optionsService: OptionsService,
    private eventsManagerService: EventsManagerService,
    private configService: ConfigService
  ) {
    this.reloadSession();
  }

  setConfig(config: any) {
    this.config = config;
    if (this.config) {
      this.apiUrl = (this.config.useApiTest) ? this.config.apiUrlTest : this.config.apiUrl;
    }
  }

  getApiUrl() {
    return this.apiUrl;
  }

  login(username: string, password: string) {
    const body = JSON.stringify({ userName: username, Password: password });

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Content-Type', 'application/json');

    return this.http.post(`${this.apiUrl}/login`, body, {
        params: {},
        headers: headers
      })
      .pipe(map((response: any) => {
        if (response && response.token) {
          // store jwt token and user details (?) in local storage to keep user logged in between page refreshes
          this.setCurrentSession(response);

          this.reloadSession();

          this.http.get(`${this.apiUrl}/myprofile`, {
            params: {},
            headers: headers
          }).subscribe(
            (user: any) => {
              let options = user?.options ?? null;
              if (!options) {
                const defaultOptions = this.optionsService.getDefaultOptions(APP_CONST.defaultLanguage);
                options = btoa(encodeURI(JSON.stringify(defaultOptions)));
              }
              localStorage.setItem(APP_CONST.storageOptions, options);

              const user_options = JSON.parse(decodeURI(atob(options)));
              this.translate.use(user_options.language);

              this.updateUserSession(user);
            }
          );
        } else {
          return { errors: { status: 401 } };
        }
        return response;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(APP_CONST.storageSession);
    localStorage.removeItem(APP_CONST.storageOptions);
    localStorage.removeItem(APP_CONST.storageTenant);

    // const _tenant = this.getCurrentTenant();

    // let headers = new HttpHeaders();
    // headers = headers.set('Accept', 'application/json');
    // headers = headers.set('Content-Type', 'application/json');
    // headers = headers.set('tenant', _tenant);

    // const options: any = {
    //   params: {},
    //   headers: headers
    // };

    // this.http.get<any[]>(`${this.apiUrl}/logout`, options).subscribe(
    //   (response: any) => {
    //     // Logout
    //   },
    //   (error: any) => {
    //     console.log('logout error', error);
    //   }
    // );
  }

  getDecodeToken() {
    const token = this.getAuthorizationToken();
    return (JSON.parse(atob(token.split('.')[1])));
  }

  getTokenExpiredDate(ms = true): any {
    const tokenInfo = this.getDecodeToken();
    return ms ? (tokenInfo.exp * 1000) : (new Date(tokenInfo.exp * 1000));
  }

  tokenExpired() {
    const expiry = this.getTokenExpiredDate() / 1000;
    // console.log('tokenExpired expiry', expiry);
    // console.log('tokenExpired now', Math.floor((new Date).getTime() / 1000));
    // console.log('tokenExpired date', new Date(expiry * 1000));
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  reloadSession() {
    this.currentSession = this.getCurrentSession();
    this.user = this.getUser();
    this.eventsManagerService.broadcast(APP_CONST.sessionUpdateEvent, this.currentSession);
  }

  updateUserSession(user) {
    this.currentSession = this.getCurrentSession();

    const data = {
      ...this.currentSession,
      user: user
    };
    this.setCurrentSession(data);

    this.reloadSession();
  }

  getUser() {
    return this.currentSession?.user ?? null;
  }

  getAuthorizationToken() {
    return this.currentSession?.token ?? 'no-auth-token';
  }

  isLogged() {
    if (this.currentSession && this.currentSession.token) {
      // logged in so return true
      return true;
    }
    return false;
  }

  setCurrentSession(data) {
    const session = btoa(encodeURI(JSON.stringify(data)));
    localStorage.setItem(APP_CONST.storageSession, session);
  }

  getCurrentSession() {
    const storage = localStorage.getItem(APP_CONST.storageSession);
    if (storage) {
      const currentSession = JSON.parse(decodeURI(atob(storage)));
      return currentSession;
    }
    return null;
  }

  setCurrentTenant(data) {
    const session = btoa(encodeURI(JSON.stringify(data)));
    localStorage.setItem(APP_CONST.storageTenant, session);
  }

  getCurrentTenant() {
    const storage = localStorage.getItem(APP_CONST.storageTenant);
    if (storage) {
      const currentTenant = JSON.parse(decodeURI(atob(storage)));
      return currentTenant?.tenant ?? '';
    }
    return '';
  }

  getTenants() {
    const user = this.getUser();
    return user?.tenants ?? [];
  }

  getUserTenant() {
    const tenants = this.getTenants();
    const index = _.findIndex(tenants, { tenantName: this.getCurrentTenant() });
    return (index !== -1) ? tenants[index].tenantUser : null;
  }

  getRoles() {
    const user = this.getUser();
    return user?.roles ?? [];
  }

  getModules(tenant = null) {
    tenant = tenant ?? this.getCurrentTenant();
    const tenants = this.getTenants();
    const idx = tenants.findIndex(x => x.tenantName === tenant);
    return (idx !== -1) ? tenants[idx].modules : [];
  }

  getPermissions(tenant = null) {
    tenant = tenant ?? this.getCurrentTenant();
    const tenants = this.getTenants();
    const idx = tenants.findIndex(x => x.tenantName === tenant);
    return (idx !== -1) ? tenants[idx].permissions : [];
  }

  hasRole(role: string) {
    const roles = this.getRoles();
    if (roles.findIndex(x => x.name === role) > -1) {
      return true;
    }
    return false;
  }

  hasPermission(value: string, grant = 'view', owner = true) {
    const uValue = value ? value.toUpperCase() : value;
    if (this.isAdmin() || uValue === 'PUBLIC') { return true; }
    const permissions = this.getPermissions();
    const idx = permissions.findIndex(o => o.codiceFunzione.toUpperCase() === uValue);
    const permission = (idx > -1) ? permissions[idx] : null;
    if (permission) {
      const grantStr = 'grant_' + grant + (owner ? '_owner' : '_other');
      return permission[grantStr];
    }
    return false;
  }

  isUser() {
    if (!this.user) {
      return false;
    } else {
      return (this.isEditor() || (_.includes(this.user.roles, 'USER')));
    }
  }

  isEditor() {
    if (!this.user) {
      return false;
    } else {
      return (this.isAdmin() || (_.includes(this.user.roles, 'EDITOR')));
    }
  }

  isAdmin() {
    if (!this.user) {
      return false;
    } else {
      return (this.isSuperAdmin() || (_.includes(this.user.roles, 'ADMIN')));
    }
  }

  isSuperAdmin() {
    if (!this.user) {
      return false;
    } else {
      return (_.includes(this.user.roles, 'SUPER_ADMIN'));
    }
  }

  private saveOptions(options) {
    // this.personaService.updateOptions(options)
    //     .subscribe(
    //         (response: any) => {
    //             // console.debug('updatePersonaOptions', response);
    //         }
    //     );
  }

  /*
    Ruoli:
    #1 - Admin: non vede Utenti Tenant e Aziende
    #2 - Amministrazione: vede Tabelle, Contatti, Tutto il menù magazzino
    #3 - Logistica: vede Contatti, Ordini, DDT, Fatture
    #4 - Commerciale: a questo livello come Admin
  */

  getTenantRole(tenant) {
    const tenants = this.getTenants();
    const idx = tenants.findIndex(x => x.tenantName === tenant);
    const role = (idx !== -1) ? tenants[idx].tenantUser.ruolo : null;
    return role;
  }

  isMenuAuth(menu) {
    let auth = true;
    if (!this.isSuperAdmin() && menu.url !== '/dashboard') {
      const permessi = {
        'Admin': [
          '/dashboard',
          // '/administrator-group',
          // '/tenants',
          // '/users',
          // '/roles-permissions',
          // '/companies',
          '/contacts-group',
          '/contacts',
          '/warehouse-group',
          '/price-lists',
          '/warehouse',
          '/ddt',
          '/invoices',
          '/orders-group',
          '/orders',
          '/quotes-group',
          '/quotes',
          '/campaigns',
          '/configuration-group',
          '/tables'
        ],
        'Amministrazione': [
          '/dashboard',
          // '/administrator-group',
          // '/tenants',
          // '/users',
          // '/roles-permissions',
          // '/companies',
          '/contacts',
          '/price-lists',
          '/warehouse',
          '/ddt',
          '/invoices',
          // '/orders',
          // '/quotes',
          // '/campaigns',
          '/configuration-group',
          '/tables'
        ],
        'Logistica': [
          '/dashboard',
          // '/administrator-group',
          // '/tenants',
          // '/users',
          // '/roles-permissions',
          // '/companies',
          '/contacts-group',
          '/contacts',
          '/warehouse-group',
          // '/price-lists',
          // '/warehouse',
          '/ddt',
          '/invoices',
          '/orders-group',
          '/orders',
          // '/quotes-group',
          // '/quotes',
          // '/campaigns',
          // '/configuration-group',
          // '/tables'
        ],
        'Commerciale': [
          '/dashboard',
          // '/administrator-group',
          // '/tenants',
          // '/users',
          // '/roles-permissions',
          // '/companies',
          '/contacts-group',
          '/contacts',
          '/warehouse-group',
          '/price-lists',
          '/warehouse',
          '/ddt',
          '/invoices',
          '/orders-group',
          '/orders',
          '/quotes-group',
          '/quotes',
          '/campaigns',
          '/configuration-group',
          '/tables'
        ],
      };

      const tenant = this.getCurrentTenant();
      const ruolo = this.getTenantRole(tenant);

      auth = ruolo && _.includes(permessi[ruolo.descrizione], menu.url);
    }

    return auth;
  }
}
