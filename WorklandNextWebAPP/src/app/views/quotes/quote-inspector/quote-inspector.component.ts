import { Component, OnInit, Input, OnChanges }	from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { AuthenticationService } from '@app/services/authentication.service';
import { QuotesService } from '../quotes.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-quote-inspector',
  templateUrl: './quote-inspector.component.html',
  styleUrls: ['./quote-inspector.component.scss']
})
export class QuoteInspectorComponent implements OnInit, OnChanges {

  @Input() quote = null;
  @Input() quoteId = null;

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
    'totaleLordoAzienda',
    'totaleLordoCliente',
    'totaleIvaAzienda',
    'totaleIvaCliente',
    'totaleNettoAzienda',
    'totaleNettoCliente',
    'totaleMerceLorda',
    'totaleMargine',
    'tipoDocumentoId',
    'isStessoFatturazione',
  ];

  constructor(
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private quotesService: QuotesService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private gridUtils: GridUtils
  ) {
    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.quote ) {
      this.quote = changes.quote.currentValue;
    }
    if (changes.quoteId ) {
      this.quoteId = changes.quoteId.currentValue;
      this.loadQuote();
    }
    if (changes.dragging) {
      this.dragging = changes.dragging.currentValue;
    }
  }

  ngOnInit() {
    this.user = this.authenticationService.getUserTenant();

    if (this.quoteId) { this.loadQuote(); }
  }

  initData() {
    // Init data
  }

  clearData() {
    this.quote = null;
    this.loadings = [];
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadQuote() {
    this.showChangePassowrd = false;
    if (this.quoteId) {
      this.loading = true;
      // Get quote
      this.quotesService.getModel(this.quoteId).subscribe(
        (response: any) => {
          const _quote = this.gridUtils.renameJson(response);
          this.quote = _quote;
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
          const message = error.message;
          this.notificationService.error(message, title);
        }
      );
    } else {
      this.clearData();
    }
  }

  beforePanelOpened(panel) {
  }
}
