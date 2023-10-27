import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedModule } from '@app/shared';

import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Import containers
import { SimpleLayoutComponent, DefaultLayoutComponent, AppLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
// import { LoginComponent } from './views/login/login.component';
// import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  SimpleLayoutComponent,
  DefaultLayoutComponent,
  AppLayoutComponent
];

// Import directives
import {
  FitDirective,
  FlexLayoutDirective,
  LazyLoadDirective
} from './directives';

const APP_DIRECTIVES = [
  FitDirective,
  FlexLayoutDirective,
  LazyLoadDirective
];

import {
  ChooseTenantModule,
  ChooseTenantCompanyModule,
  // FilterTextboxModule,
  // HelpModule,
  // ReadMoreModule
} from '@app/components';

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@app/components/coreui';
// } from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DialogService } from 'ngx-bootstrap-modal';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { AvatarModule } from 'ngx-avatar';

// Translation
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'moment/locale/it';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

import { AuthGuard } from '@app/guard/auth.guard';
import { AuthenticationService, WorklandService, OptionsService, UtilsService } from '@app/services';
import { TableModalService } from '@app/services/tables-modal.service';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { ModalTableManagerModule } from '@app/components/modal-table-manager/modal-table-manager.module';

import { httpInterceptorProviders } from '@app/core/http-interceptors';
// import { CacheRouteReuseStrategy } from '@app/strategy/cache-route-reuse.strategy';
// import { CustomRouteReuseStategy } from '@app/strategy/custom-route-reuse.strategy';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { ConfigService } from './services/config.service';

export function ConfigLoader(configService: ConfigService) {
  // Note: this factory need to return a function (that return a promise)
  return () => configService.load(environment.configFile);
}

export function playerFactory() {
  return player;
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    DragDropModule,
    AppRoutingModule,
    ChooseTenantModule,
    ChooseTenantCompanyModule,
    // FilterTextboxModule,
    // HelpModule,
    // ReadMoreModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,

    SharedModule,

    SnotifyModule,

    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    NgJsonEditorModule,
    AvatarModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    LottieModule.forRoot({
      player: playerFactory,
      useCache: true
    }),

    ModalTableManagerModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_DIRECTIVES,
    P404Component,
    P500Component,
    // LoginComponent,
    // RegisterComponent
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    httpInterceptorProviders,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService,
    BsLocaleService,
    DialogService,
    AuthGuard,
    AuthenticationService,
    WorklandService,
    OptionsService,
    UtilsService,
    TableModalService,
    ValidationService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
