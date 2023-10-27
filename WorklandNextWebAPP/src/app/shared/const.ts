import { environment } from '../../environments/environment';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { SnotifyToastConfig, SnotifyPosition } from 'ng-snotify';

export const APP_CONST = {
  production: environment.production,

  apiUrl: environment.apiUrl,
  siteUrl: environment.siteUrl,
  baseUrl: environment.baseUrl,
  assetUrl: environment.assetUrl,
  mediaUrl: environment.mediaUrl,

  versions: environment.versions,
  appVersion: environment.versions.app,

  showJsonEditor: true,

  originalFolder: 'original/',
  mediumFolder: 'medium/',
  thumbFolder: 'thumb/',
  avatarFolder: 'thumb/',

  storageSession: 'wrkl_session',
  storageTenant: 'wrkl_tenant',
  storageOptions: 'wrkl_options',
  optionsVersion: '0.1',

  sessionUpdateEvent: '$session-updated',
  profileUpdateEvent: '$profile-updated',
  userUpdateEvent: '$user-updated',
  contactUpdateEvent: '$contact-updated',
  companyUpdateEvent: '$company-updated',
  tableUpdateEvent: '$table-updated',
  quoteUpdateEvent: '$quote-updated',
  orderUpdateEvent: '$order-updated',
  ddtUpdateEvent: '$ddt-updated',
  invoiceUpdateEvent: '$ddt-updated',

  toggleSidebarEvent: '$toggle-sidebar',
  toggleSidebarMinimizerEvent: '$toggle-sidebar-minimizer',
  toggleMobileSidebarEvent: '$toggle-mobile-sidebar',
  closeSidebarEvent: '$close-sidebar',
  toggleBrandMinizerEvent: '$toggle-brand-minizer',
  toggleAsideEvent: '$toggle-aside',
  closeFloatPanelEvent: '$close-float-panel',
  openTabEvent: '$open-tab',

  languages: ['en', 'es', 'fr', 'it'],

  defaultLanguage: 'it',
  defaultUnits: 'km',
  defaultView: 'post', // post - list - map
  defaultImageSize: '900',

  defaultPagination: {
    limit: 0,
    perPage: 15,
    maxPages: 5,
    perPageArr: ['1', '3', '5', '10', '15', '20', '25', '50', '100', '150', '200']
  },

  mediumTypes: [
    'mediums',
    'avatars'
  ],

  user_roles: [
    { name: 'user_role_0', value: 0 },
    { name: 'user_role_1', value: 1 },
    { name: 'user_role_2', value: 2 },
    { name: 'user_role_255', value: 255 }
  ],

  notification_options: {
    timeOut: 1500,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: 'visible',
    rtl: false,
    animate: 'scale',
    position: ['right', 'bottom']
  },

  snotify_options: <SnotifyToastConfig>{
    timeout: 4000,
    showProgressBar: false,
    type: 'simple',
    position: SnotifyPosition.rightBottom
  },

  loadingOptions: {
    animationType: ngxLoadingAnimationTypes.threeBounce,
    // animationType: ngxLoadingAnimationTypes.chasingDots,
    // animationType: ngxLoadingAnimationTypes.doubleBounce,
    // animationType: ngxLoadingAnimationTypes.circle,
    // animationType: ngxLoadingAnimationTypes.circleSwish,
    // animationType: ngxLoadingAnimationTypes.cubeGrid,
    // animationType: ngxLoadingAnimationTypes.pulse,
    // animationType: ngxLoadingAnimationTypes.rectangleBounce,
    // animationType: ngxLoadingAnimationTypes.wanderingCubes,
    backdropBackgroundColour: 'rgba(255, 255, 255, 0.5)',
    backdropBorderRadius: '0px',
    primaryColour: 'rgb(247, 200, 105)',
    secondaryColour: 'rgba(247, 200, 105, 0.55)',
    tertiaryColour: 'rgb(247, 200, 105)'
  },

  fieldExcluded: [
    // ALL
    'id',
    'dataDelete',
    'dataInsert',
    'dataUpdate',
    'aziendaId',
    'azienda',
    'aziendeList',
    'utenteDeleteId',
    'utenteInsertId',
    'utenteUpdateId',
    // Nazioni
    'dataIngressoBlackList',
    // Contatti
    'contattoId',
    'tipoContattoList',
    'anagLinguaId',
    'anagNazioneId',
    'anagValutaId',
    'anagValutaId',
    'aziendaInserimentoId',
    'aziendaInserimento',
    'aziendeContabilitaList',
    'unitaList',
    'unitaId',
    'clienteId',
    'cliente',
    'contatto',
    'clienteContabilitaCCList',
    'datiUnita',
    'anagIVAId',
    'anagTipoPagamentoId',
    'anagPortoId',
    'filialeId',
    'referenteCommercialeId',
    'utenteUltimoAggiornamentoFidoId',
    'aziendaBlocco',
    'dataInizioInt',
    'anagIvaId',
    'fornitoreId',
    'anagTipoClienteId',
    'anagValutazioneId',
    'anagOrigineContattoId',
    'anagShipTypeId',
    'anagShipyardId',
    'anagAbiId',
    'anagCabId',
    'anagModalitaPagamentoId',
    'porto',
    'proprietario',
    'utenteDeleteID',
    'utenteInsertID',
    'utenteUpdateID',
    'aziendaInserimentoDescrizione',
    'aziendaInserimentoPathLogo',
    'specializzazioneContattoType',
    'aziendaBlocco',
    'aziendaBloccoDescrizione',
    'aziendaBloccoPathLogo',
    'aziendaDescrizione',
  ],

  statoDocumento: [
    { id: 1, descrizione: 'Aperto' },
    { id: 1, descrizione: 'Chiuso' }
  ],

  publish_status: [
    { name: 'draft', value: 0 },
    { name: 'published', value: 1 }
  ],

  video_formats: [
    { name: 'video/mp4', value: 'mp4' },
    { name: 'video/ogg', value: 'oogg' },
    { name: 'video/webm', value: 'webm' },
    { name: 'youtube', value: 'youtube' }
  ],

  chartColours: [
    { // primary
      backgroundColor: 'rgba(247,200,105,0.2)',
      borderColor: 'rgba(247,200,105,1)',
      pointBackgroundColor: 'rgba(247,200,105,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(247,200,105,0.8)'
    },
    { // blue
      backgroundColor: 'rgba(91,163,231,0.2)',
      borderColor: 'rgba(91,163,231,1)',
      pointBackgroundColor: 'rgba(91,163,231,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(91,163,231,0.8)'
    },
    { // green
      backgroundColor: 'rgba(65,189,189,0.2)',
      borderColor: 'rgba(65,189,189,1)',
      pointBackgroundColor: 'rgba(65,189,189,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(65,189,189,0.8)'
    },
    { // ligth green
      backgroundColor: 'rgba(180,189,76,0.2)',
      borderColor: 'rgba(180,189,76,1)',
      pointBackgroundColor: 'rgba(180,189,76,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(180,189,76,0.8)'
    },
    { // purple
      backgroundColor: 'rgba(142,150,198,0.2)',
      borderColor: 'rgba(142,150,198,1)',
      pointBackgroundColor: 'rgba(142,150,198,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(142,150,198,0.8)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ],

  contactType: [
    { name: 'Cliente', value: 'cliente' },
    { name: 'Fornitore', value: 'fornitore' },
    { name: 'Unita', value: 'unita' },
    { name: 'Vettore', value: 'vettore' },
    // { name: 'Agente', value: 'agente' }
  ],

  author: 'AT@'
};
