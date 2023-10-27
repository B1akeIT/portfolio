import { Component, OnInit, Input, OnChanges }	from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { AuthenticationService } from '@app/services/authentication.service';
import { ActivitiesService } from '../activities.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-activity-inspector',
  templateUrl: './activity-inspector.component.html',
  styleUrls: ['./activity-inspector.component.scss']
})
export class ActivityInspectorComponent implements OnInit, OnChanges {

  @Input() activity = null;
  @Input() activityId = null;

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
    private activitiesService: ActivitiesService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private gridUtils: GridUtils
  ) {
    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.activity ) {
      this.activity = changes.activity.currentValue;
    }
    if (changes.activityId ) {
      this.activityId = changes.activityId.currentValue;
      this.loadActivity();
    }
    if (changes.dragging) {
      this.dragging = changes.dragging.currentValue;
    }
  }

  ngOnInit() {
    this.user = this.authenticationService.getUserTenant();

    if (this.activityId) { this.loadActivity(); }
  }

  initData() {
    // Init data
  }

  clearData() {
    this.activity = null;
    this.loadings = [];
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadActivity() {
    this.showChangePassowrd = false;
    if (this.activityId) {
      this.loading = true;
      // Get activity
      this.activitiesService.getModel(this.activityId).subscribe(
        (response: any) => {
          const _activity = this.gridUtils.renameJson(response);
          this.activity = _activity;
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
