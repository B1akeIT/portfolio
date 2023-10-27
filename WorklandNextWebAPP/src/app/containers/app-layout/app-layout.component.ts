import { Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

// import { INavData } from '@coreui/angular';
import { INavData } from '@app/components/coreui';
import { navItemsAdmin, navItemsDashboard, navItemsUsers, navItemsDevelop } from '@app/_nav';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { ConfigService } from '@app/services/config.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './app-layout.component.html'
})
export class AppLayoutComponent implements OnInit, AfterViewInit {
  public sidebarMinimized = false;
  public navItems: INavData[] = [];
  public showDevelopMenu = false; // !APP_CONST.production;
  public showUserMenu = false;

  user = null;
  tenants = [];
  currentTenant = '';
  currentModules = [];

  logoCopyright = '';
  copyright = '';

  version = APP_CONST.appVersion;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService,
    private configService: ConfigService,
    private authenticationService: AuthenticationService,
    private eventsManagerService: EventsManagerService
  ) {
    this.generateNavMenu();

    const config = this.configService.getConfiguration();
    this.logoCopyright = config.logoCopyright;
    this.copyright = config.copyright;

    this.eventsManagerService.on(APP_CONST.sessionUpdateEvent, (event) => {
      this.user = this.authenticationService.getUser();
      this.tenants = this.authenticationService.getTenants();
      this.generateNavMenu();
      if (!this.currentTenant) { this.router.navigate(['/dashboard']); }
    });
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUser();
    this.tenants = this.authenticationService.getTenants();
    // this.setAutoTenant();

    if (this.authenticationService.tokenExpired()) {
      this.authenticationService.logout();
      this.router.navigate(['/auth/login']);
    }
  }

  ngAfterViewInit() {
    if (this.authenticationService.tokenExpired()) {
      this.router.navigate(['/auth/login']);
    }
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  toggleUserMenu(e) {
    this.showUserMenu = !this.showUserMenu;
    this.generateNavMenu();
  }

  generateNavMenu() {
    let navItems = [...navItemsDashboard, ...navItemsAdmin];
    if (this.showUserMenu) {
      navItems = [...navItems, ...navItemsUsers];
      if (this.showDevelopMenu) {
        navItems = [...navItems, ...navItemsDevelop];
      }
    }
    this.navItems = navItems;
  }

  setAutoTenant() {
    const hasCurrentTenant = (this.authenticationService.getCurrentTenant() !== '');
    if (!hasCurrentTenant) {
      if (this.tenants.length === 1) {
        this.onTenantChanged(this.tenants[0].tenantName);
      // } else {
      //   // Force TenantVSS
      //   const index = _.findIndex(this.tenants, { tenantName: 'TenantVSS' });
      //   const tenant = (index !== -1) ? this.tenants[index] : null;
      //   if (tenant) {
      //     console.log('setAutoTenant TenantVSS', tenant);
      //     this.onTenantChanged(tenant.tenantName);
      //   }
      }
    }
  }

  onTenantChanged(event) {
    this.showUserMenu = (event !== null);
    this.currentTenant = event;
    this.authenticationService.setCurrentTenant({tenant: event});
    this.authenticationService.reloadSession();
    this.currentModules = this.authenticationService.getModules();
    this.generateNavMenu();
  }

  getUserAvatar() {
    const userAvatar = (this.user && this.user.id === '465b1dd4-0295-4229-8bcb-1e8e13cded53') ? 'assets/img/avatars/AT@-02.png' : '';
    return this.currentTenant ? '' : userAvatar;
  }

  getUserName() {
    const userNameDefault = this.user?.userName ?? 'Alfonso Tatarelli';
    const index = _.findIndex(this.tenants, { tenantName: this.currentTenant });
    const tenantUser = (index !== -1) ? this.tenants[index].tenantUser : null;
    return tenantUser ? `${tenantUser.nome} ${tenantUser.cognome}` : userNameDefault;
  }

  getRoleName() {
    const userRoleDefault = '';
    const index = _.findIndex(this.tenants, { tenantName: this.currentTenant });
    const tenantUser = (index !== -1) ? this.tenants[index].tenantUser : null;
    return tenantUser && tenantUser.ruolo ? `${tenantUser.ruolo.descrizione}` : userRoleDefault;
  }

  loadStyle(styleName: string) {
    const head = this.document.getElementsByTagName('head')[0];

    const themeLink = this.document.getElementById(
      'client-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `assets/themes/${styleName}.css`;

      head.appendChild(style);
    }
  }

  getLogoBrand(reduced = false) {
    const logoText = this.currentTenant ? 'Versilia Supply Service' : 'Workland CRM';
    const logoNormal = this.currentTenant ?
      { src: 'assets/img/brand/logo-vss-h.png', width: 240, height: 50, alt: logoText } :
      { src: 'assets/img/brand/logo-workland-crm-h.png', width: 240, height: 36, style: 'margin-left: 5px;', alt: logoText };
    const logoReduced = this.currentTenant ?
      { src: 'assets/img/brand/logo-vss-reduced.png', width: 40, height: 40, alt: logoText } :
      { src: 'assets/img/brand/logo-workland-crm-mini.png', width: 50, height: 25, style: 'margin-left: 5px;', alt: logoText };

    return (reduced ? logoReduced : logoNormal);
  }
}
