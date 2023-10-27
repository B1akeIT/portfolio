import { Component, OnInit, Input, OnChanges }	from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { AuthenticationService } from '@app/services/authentication.service';
import { InvoicesService } from '../invoices.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-invoice-inspector',
  templateUrl: './invoice-inspector.component.html',
  styleUrls: ['./invoice-inspector.component.scss']
})
export class InvoiceInspectorComponent implements OnInit, OnChanges {

  @Input() invoice = null;
  @Input() invoiceId = null;

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
    private invoicesService: InvoicesService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private gridUtils: GridUtils
  ) {
    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.invoice ) {
      this.invoice = changes.invoice.currentValue;
    }
    if (changes.invoiceId ) {
      this.invoiceId = changes.invoiceId.currentValue;
      this.loadInvoice();
    }
    if (changes.dragging) {
      this.dragging = changes.dragging.currentValue;
    }
  }

  ngOnInit() {
    this.user = this.authenticationService.getUserTenant();

    if (this.invoiceId) { this.loadInvoice(); }
  }

  initData() {
    // Init data
  }

  clearData() {
    this.invoice = null;
    this.loadings = [];
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadInvoice() {
    this.showChangePassowrd = false;
    if (this.invoiceId) {
      this.loading = true;
      // Get invoice
      this.invoicesService.getModel(this.invoiceId).subscribe(
        (response: any) => {
          const _invoice = this.gridUtils.renameJson(response);
          this.invoice = _invoice;
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
