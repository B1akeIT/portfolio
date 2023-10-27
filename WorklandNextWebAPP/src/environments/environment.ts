// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

declare var require: any;

const packageJson = require('../../package.json');

export const environment = {
  production: false,

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
