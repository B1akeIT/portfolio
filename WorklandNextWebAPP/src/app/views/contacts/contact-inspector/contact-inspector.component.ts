import { Component, OnInit, Input, OnChanges }	from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { AuthenticationService } from '@app/services/authentication.service';
import { ContactsService } from '../contacts.service';
import { TenantsService } from '@app/views/tenants/tenants.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-contact-inspector',
  templateUrl: './contact-inspector.component.html',
  styleUrls: ['./contact-inspector.component.scss']
})
export class ContactInspectorComponent implements OnInit, OnChanges {

  @Input() contact = null;
  @Input() contactId = null;

  @Input() showAvatar = false;
  @Input() showEdit = false;
  @Input() showIcon = true;
  @Input() showLabel = false;
  @Input() dragging = false;

  loading = false;
  loadingTenants = false;
  loadingOptions = APP_CONST.loadingOptions;
  modified = false;
  isAddNew = false;

  user = null;

  newTenant = null;
  tenants = [];
  tenantsMeta = null;

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
  contactTypeData = [];
  tipoContattoList = [];

  logoBrand = null;

  aziende = [
    'VERSILIA SUPPLY SERVICE SRL',
    'VERSILIA SUPPLY SERVICE SRL',
    'VERSILIA SUPPLY SERVICE SRL',
    'VERSILIA SUPPLY SERVICE SRL',
    'VERSILIA SUPPLY SERVICE SRL',
    'VERSILIA SUPPLY SERVICE SRL'
  ];

  objectKey = Object.keys;

  excluded = APP_CONST.fieldExcluded;
  excludedForShip = [ ...APP_CONST.fieldExcluded , 'ragioneSociale'];

  constructor(
    private authenticationService: AuthenticationService,
    private contactsService: ContactsService,
    private tenantsService: TenantsService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private utilsService: UtilsService
  ) {
    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.contact ) {
      this.contact = changes.contact.currentValue;
    }
    if (changes.contactId ) {
      this.contactId = changes.contactId.currentValue;
      this.loadContact();
    }
    if (changes.dragging) {
      this.dragging = changes.dragging.currentValue;
    }
  }

  ngOnInit() {
    this.user = this.authenticationService.getUserTenant();

    if (this.contactId) { this.loadContact(); }
  }

  initData() {
    // Init data
  }

  clearData() {
    this.logoBrand = null;
    this.contact = null;
    this.loadings = [];
    this.contactTypeData = [];
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadContact() {
    this.showChangePassowrd = false;
    if (this.contactId) {
      this.loading = true;
      // Get contact
      this.contactsService.getModel(this.contactId).subscribe(
        (response: any) => {
          this.contact = response;
          this.tipoContattoList = this.contact.specializzazioneContattoType ? this.contact.specializzazioneContattoType.split(';') : [];
          this.tipoContattoList.forEach(item => {
            this.loadings[item] = true;
            this.contactTypeData[item] = null;
          });
          this.logoBrand = this.getLogoBrand();
          this.loading = false;
        }
      );
    } else {
      this.clearData();
    }
  }

  loadContactType(type) {
    this.loadings[type] = true;
    if ( type === 'Vettore') {
      this.contactsService.getContactCarrier(this.contact.id).subscribe(
        (resp: any) => {
          this.contactTypeData[type] = resp;
          this.loadings[type] = false;
        }
      );
    } else {
      this.contactsService.getContactType(this.contact.id, type).subscribe(
        (resp: any) => {
          this.contactTypeData[type] = resp;
          this.loadings[type] = false;
        }
      );
    }
  }

  beforePanelOpened(panel) {
    this.loadContactType(panel);
  }

  getLogoBrand(reduced = false) {
    const currentTenant = true;
    const logoText = currentTenant ? 'Versilia Supply Service' : 'Workland CRM';
    const logoNormal = currentTenant ?
      { src: 'assets/img/brand/logo-vss-h.png', width: 240, height: 50, alt: logoText } :
      { src: 'assets/img/brand/logo-workland-crm-h.png', width: 260, height: 39, style: 'margin-left: 5px;', alt: logoText };
    const logoReduced = currentTenant ?
      { src: 'assets/img/brand/logo-vss-reduced.png', width: 30, height: 30, alt: logoText } :
      { src: 'assets/img/brand/logo-workland-crm-mini.png', width: 50, height: 25, style: 'margin-left: 5px;', alt: logoText };

    return (reduced ? logoReduced : logoNormal);
  }

  isUnita() {
    return this.utilsService.hasValueString(this.contact.specializzazioneContattoType, 'Unita');
  }
}
