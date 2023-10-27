import { Component, OnInit, Input, OnChanges }	from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { CompaniesService } from '../companies.service';
import { TenantsService } from '@app/views/tenants/tenants.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-company-inspector',
  templateUrl: './company-inspector.component.html',
  styleUrls: ['./company-inspector.component.scss']
})
export class CompanyInspectorComponent implements OnInit, OnChanges {

  @Input() tenant = null;
  @Input() company = null;
  @Input() companyId = null;

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

  newTenant = null;
  tenants = [];
  tenantsMeta = null;

  options: AnimationOptions = {
    path: '/assets/animations/finger-click.json',
    loop: false
  };

  roles = [];

  loadings = [];
  panelData = [];
  contactTypeData = [];
  contactMagazzinoData = [];
  contactFilialeData = [];

  logoBrand = null;

  excluded = APP_CONST.fieldExcluded;

  constructor(
    private companiesService: CompaniesService,
    private tenantsService: TenantsService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    public gridUtils: GridUtils
  ) {
    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.company ) {
      this.company = changes.company.currentValue;
    }
    if (changes.companyId ) {
      this.companyId = changes.companyId.currentValue;
      this.loadCompany();
    }
    if (changes.dragging) {
      this.dragging = changes.dragging.currentValue;
    }
  }

  ngOnInit() {
    if (this.companyId) { this.loadCompany(); }
  }

  initData() {
    // Init data
  }

  clearData() {
    this.logoBrand = null;
    this.company = null;
    this.loadings = [];
    this.contactTypeData = [];
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadCompany() {
    if (this.companyId) {
      this.loading = true;
      // Get company
      this.companiesService.getModel(this.companyId).subscribe(
        (response: any) => {
          this.company = this.gridUtils.renameJson(response);
          // this.company.tipoContattoList.forEach(item => {
          //   this.loadings[item.name] = true;
          //   this.contactTypeData[item.name] = null;
          // });
          this.logoBrand = this.getLogoBrand();
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          // this.error = true;
          // this.errorMessage = error.message;
          console.log('loadCompany error', error);
        }
      );
    } else {
      this.clearData();
    }
  }

  loadPanelData(panel, item) {
    const panelName = panel + '-' + item.id;
    this.loadings[panelName] = true;
    this.panelData[panelName] = {};
    // this.companiesService.getContactType(this.company.id, panel).subscribe(
    //   (resp: any) => {
    //     this.panelData[panelName] = resp;
    //     this.loadings[panelName] = false;
    //   }
    // );
  }

  getCompanyField(field, html = true) {
    let result = '---';

    let wa = null;

    switch (field) {
      case 'phone':
      case 'mobile':
      case 'email':
      case 'pec':
        wa = (this.company && this.company[field]) ? this.company[field] : null;
        if (wa) {
          if (html) {
            result = '<span class="badge badge- d-none">' + field + '</span>' + ' <span>' + wa + '</span>';
          } else {
            result = wa;
          }
        }
        break;

      case 'website':
        wa = (this.company && this.company[field]) ? this.company[field] : null;
        if (wa) {
          if (html) {
            result = '<a href="' + wa + '" target="_new">';
            result += '<span class="badge badge-light">' + field + '</span>' + ' <span>' + wa + '</span></a>';
          } else {
            result = wa;
          }
        }
        break;
    }

    return result;
  }

  beforePanelOpened(panel, item) {
    this.loadPanelData(panel, item);
  }

  getLogoBrand(reduced = false) {
    const currentTenant = true;
    const logoText = currentTenant ? 'Versilia Supply Service' : 'Workland CRM';
    const logoNormal = currentTenant ?
      { src: 'assets/img/brand/logo-vss-h.png', width: 140, height: 29, alt: logoText } :
      { src: 'assets/img/brand/logo-workland-crm-h.png', width: 260, height: 39, style: 'margin-left: 5px;', alt: logoText };
    const logoReduced = currentTenant ?
      { src: 'assets/img/brand/logo-vss-reduced.png', width: 30, height: 30, alt: logoText } :
      { src: 'assets/img/brand/logo-workland-crm-mini.png', width: 50, height: 25, style: 'margin-left: 5px;', alt: logoText };

    return (reduced ? logoReduced : logoNormal);
  }
}
