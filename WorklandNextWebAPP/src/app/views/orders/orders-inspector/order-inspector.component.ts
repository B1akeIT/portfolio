import { Component, OnInit, Input, OnChanges }	from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { AuthenticationService } from '@app/services/authentication.service';
import { OrdersService } from '../orders.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-order-inspector',
  templateUrl: './order-inspector.component.html',
  styleUrls: ['./order-inspector.component.scss']
})
export class OrderInspectorComponent implements OnInit, OnChanges {

  @Input() order = null;
  @Input() orderId = null;

  @Input() showAvatar = false;
  @Input() showEdit = false;
  @Input() showIcon = true;
  @Input() showLabel = false;
  @Input() dragging = false;

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  modified = false;
  isAddNew = false;

  user = null;

  options: AnimationOptions = {
    path: '/assets/animations/finger-click.json',
    loop: false
  };

  showChangePassowrd = false;
  showChangeEmail = false;
  showChangeRole = false;

  emailForm: FormGroup;
  emailModel: { email: string };
  emailFields: FormlyFieldConfig[];

  roleForm: FormGroup;
  roleModel: { roleId: number };
  roleFields: FormlyFieldConfig[];

  optionsForm: FormlyFormOptions;

  roles = [];

  loadings = [];

  objectKey = Object.keys;

  excluded = [
    ...APP_CONST.fieldExcluded,
    'numero',
    'titolo',
    'stato',
    'dataCreazione',
    'dataScadenza',
    'stato',
    'nominativoIntestatario',
    'indirizzoIntestatario',
    'capIntestatario',
    'comuneIntestatario',
    'provinciaIntestatario',
    'nazioneIntestatario',
    'nominativoDestinazione',
    'indirizzoDestinazione',
    'capDestinazione',
    'comuneDestinazione',
    'provinciaDestinazione',
    'nazioneDestinazione',
    'nominativoFatturazione',
    'indirizzoFatturazione',
    'capFatturazione',
    'comuneFatturazione',
    'provinciaFatturazione',
    'nazioneFatturazione',
    'piva',
    'codiceFiscale',
    'categoriaDocumentoId',
    'categoriaDocumentoDescrizione',
    'totaleInValuta',
    'totaleLordoAzienda',
    'totaleLordo',
    'totaleIvaAzienda',
    'totaleIva',
    'totaleNettoAzienda',
    'totaleNetto',
    'totaleMerceLorda',
    'totaleMargine',
    'totaleSconto',
    'trasportoTotale',
    'sezionaleId',
    'magazzinoId',
    'nazioneIntestatarioId',
    'nazioneFatturazioneId',
    'nazioneDestinazioneId',
    'ivaTrasportoId',
    'ivaImballoId',
    'tipoDocumentoId',
    'statoDocumentoId',
    'anagIVACodiceTrasporto',
    'anagIVACodiceImballo',
    'ivaDoganaCustomId',
    'anagIVACodiceDogana',
    'ivaBolliSuEffettiId',
    'ivaBolliSuEsentiId',
    'ivaAltreSpeseId',
    'anagIVACodiceAltreSpese',
    'tipoDocumentoCodice',
    'isReadOnly',
    'contattoIntestatarioId',
    'clienteIntestatarioId',
    'contattoDestinazioneId',
    'cambio',
    'anagValutaId',
    'riferimentoCommercialeId',
    'valutaDiRedazioneId',
    'vettoreId',
    'anagDepartmentId',
    'anagValutazioneColore',
    'anagValutazioneIsEvidenzia',
    'bancaAziendaId',
  ];

  constructor(
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private ordersService: OrdersService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private gridUtils: GridUtils
  ) {
    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.order ) {
      this.order = changes.order.currentValue;
    }
    if (changes.orderId ) {
      this.orderId = changes.orderId.currentValue;
      this.loadOrder();
    }
    if (changes.dragging) {
      this.dragging = changes.dragging.currentValue;
    }
  }

  ngOnInit() {
    this.user = this.authenticationService.getUserTenant();

    if (this.orderId) { this.loadOrder(); }
  }

  initData() {
    // Init data
  }

  clearData() {
    this.order = null;
    this.loadings = [];
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadOrder() {
    this.showChangePassowrd = false;
    if (this.orderId) {
      this.loading = true;
      // Get order
      this.ordersService.getModel(this.orderId).subscribe(
        (response: any) => {
          const _order = this.gridUtils.renameJson(response);
          this.order = _order;
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
          this.notificationService.error(error.message, title);
        }
      );
    } else {
      this.clearData();
    }
  }

  beforePanelOpened(panel) {
  }
}
