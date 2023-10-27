declare var require: any;

const packageJson = require('../../package.json');

export const environment = {
  production: true,

  buildVersion: '1.231005.1411',

  versions: {
    app: packageJson.version,
    coreui: packageJson.dependencies['@coreui/coreui'],
    coreuiangular: packageJson.dependencies['@coreui/angular'],
    coreuiicons: packageJson.dependencies['@coreui/icons'],
    angular: packageJson.dependencies['@angular/core'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    aggridangular: packageJson.dependencies['ag-grid-angular'],
    aggridcommunity: packageJson.dependencies['ag-grid-community'],
    flexlayout: packageJson.dependencies['@angular/flex-layout'],
    ngxformly: packageJson.dependencies['@ngx-formly/core'],
    fontAwesome: packageJson.dependencies['font-awesome'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript']
  },

  apiUrl: 'http://webservicenext.worklandcrm.it/api/v1',
  siteUrl: 'http://webservicenext.worklandcrm.it',
  baseUrl: 'http://webservicenext.worklandcrm.it/',
  assetUrl: 'http://webservicenext.worklandcrm.it/assets/',
  mediaUrl: 'http://webservicenext.worklandcrm.it/assets/',

  configFile: './assets/config/app-config.json'
};
