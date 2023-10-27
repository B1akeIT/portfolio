import { Component, OnInit, Input, OnChanges }	from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { AuthenticationService } from '@app/services/authentication.service';
import { DdtService } from '../ddt.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-ddt-inspector',
  templateUrl: './ddt-inspector.component.html',
  styleUrls: ['./ddt-inspector.component.scss']
})
export class DdtInspectorComponent implements OnInit, OnChanges {

  @Input() ddt = null;
  @Input() ddtId = null;

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

  error: Boolean = false;
  errorMessage: string = '';

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
    'totaleLordoAzienda',
    'totaleLordoCliente',
    'totaleIvaAzienda',
    'totaleIvaCliente',
    'totaleNettoAzienda',
    'totaleNettoCliente',
    'totaleMerceLorda',
    'totaleMargine',
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
    'anagTrasportoACuraDelId',
    'banca',
    'anagIVACodice',
    'anagCausaleTrasportoId',
    'anagUDMPesoId',
    'isGeneratoDaOrdiniCliente',
    'clienteIntestatarioId',
    'contattoFatturazioneId',
    'modalitaPagamentoAziendaId',
    'bancaAziendaId',
  ];

  constructor(
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private ddtService: DdtService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private gridUtils: GridUtils
  ) {
    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.ddt ) {
      this.ddt = changes.ddt.currentValue;
    }
    if (changes.ddtId ) {
      this.ddtId = changes.ddtId.currentValue;
      this.loadDdt();
    }
    if (changes.dragging) {
      this.dragging = changes.dragging.currentValue;
    }
  }

  ngOnInit() {
    this.user = this.authenticationService.getUserTenant();

    if (this.ddtId) { this.loadDdt(); }
  }

  initData() {
    // Init data
  }

  clearData() {
    this.ddt = null;
    this.loadings = [];
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadDdt() {
    this.showChangePassowrd = false;
    if (this.ddtId) {
      this.loading = true;
      // Get ddt
      this.ddtService.getModel(this.ddtId).subscribe(
        (response: any) => {
          const _ddt = this.gridUtils.renameJson(response);
          this.ddt = _ddt;
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
          // this.error = true;
          this.errorMessage = error.message;
          this.notificationService.error(this.errorMessage, title);
        }
      );
    } else {
      this.clearData();
    }
  }

  beforePanelOpened(panel) {
  }
}
