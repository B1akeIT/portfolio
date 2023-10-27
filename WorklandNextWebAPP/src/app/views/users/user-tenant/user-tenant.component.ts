import { Component, OnInit, Input, OnChanges, Output, EventEmitter }	from '@angular/core';
import { forkJoin } from 'rxjs';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { TablesService } from '@app/views/tables/tables.service';
import { UtilsService } from '@app/services/utils.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UsersService } from '../users.service';

import { APP_CONST } from '@app/shared';
import { User } from '@app/models/user.model';

import { map } from 'rxjs/operators';

import * as _ from 'lodash';

@Component({
  selector: 'app-user-tenant',
  templateUrl: './user-tenant.component.html',
  styleUrls: ['./user-tenant.component.scss']
})
export class UserTenantComponent implements OnInit, OnChanges {

  @Input() principalId = null;
  @Input() tenant = null;
  @Input() user: User = null;

  @Input() editing = false;
  @Input() showEdit = true;
  @Input() showIcon = true;
  @Input() showLabel = false;
  @Input() showEmpty = true;

  @Output()
  saved: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;

  userForm: FormGroup;
  userModel: User;
  userFields: Array<FormlyFieldConfig>;
  options: FormlyFormOptions;

  roles = [];
  companies = [];

  isNew = false;

  anagraficheCombo = [];

  constructor(
    private authenticationService: AuthenticationService,
    private tablesService: TablesService,
    private utilsService: UtilsService,
    private notificationService: NotificationService,
    private usersService: UsersService
  ) {
    this.tenant = this.authenticationService.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.tenant);
  }

  ngOnChanges(changes: any) {
    if (changes.tenant) {
      this.tenant = changes.tenant.currentValue;
      this.initData();
    }
    if (changes.user) {
      this.user = changes.user.currentValue ?? {};
      this.isNew = (changes.user.currentValue === null);
      this.editing = this.isNew;
      if (this.editing) { this.initForm(); }
    }
    if (changes.editing) {
      this.editing = changes.editing.currentValue;
      // if (this.editing) { this.initForm(); }
    }
  }

  ngOnInit() {}

  initData() {
    const combos = [
      'SpComboMansione',
      'SpComboAzienda',
      { name: 'SpComboMagazzino', aziendaId: this.user.aziendaId },
      'SpComboDepartment',
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

    this.roles = [];

    const roles$ = this.usersService.getListRole(this.tenant);
    // this.loadCompanies();

    forkJoin([
      roles$,
    ]).subscribe((results: Array<any>) => {
      this.roles = results[0].items;

      this.initForm();
    });
  }

  loadCompanies() {
    this.companies = [];
    this.usersService.getAziende(this.tenant).subscribe(
      (resp: any) => {
        this.companies = resp
          .filter(company => company.aziendaId === null)
          .map(function(cmp) {
            return {
              id: cmp.id,
              descrizione: cmp.contatto.ragioneSociale
            };
          });
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  initForm() {
    this.user.anagCredenzialeID = this.principalId;

    this.userForm = new FormGroup({});
    this.userModel = new User(this.user);
    const modifiedFields = [
      {
        key: 'anagRuoloId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.role',
          placeholder: 'APP.FIELD.role',
          options: this.roles,
          valueProp: 'id',
          labelProp: 'descrizione',
          appearance: 'legacy'
        }
      },
      {
        key: 'aziendaId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.company',
          placeholder: 'APP.FIELD.company',
          options: this.anagraficheCombo['SpComboAzienda'],
          valueProp: 'id',
          labelProp: 'descrizione',
          appearance: 'legacy',
          change: (field, $event) => { this._updateMagazzini(); }
        }
      },
      {
        key: 'departmentId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.department',
          placeholder: 'APP.FIELD.department',
          options: this.anagraficheCombo['SpComboDepartment'],
          valueProp: 'id',
          labelProp: 'descrizione',
          appearance: 'legacy'
        }
      },
      {
        key: 'anagMansioneId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.mansioneId',
          placeholder: 'APP.FIELD.mansioneId',
          options: this.anagraficheCombo['SpComboMansione'],
          valueProp: 'id',
          labelProp: 'descrizione',
          appearance: 'legacy'
        }
      },
      {
        key: 'magazzinoId',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'APP.FIELD.magazzinoId',
          placeholder: 'APP.FIELD.magazzinoId',
          options: this.anagraficheCombo['SpComboMagazzino'],
          valueProp: 'id',
          labelProp: 'descrizione',
          appearance: 'legacy'
        }
      }
    ];
    const additionalFields = [];
    const replacedItems = this.userModel.formField().map(x => {
      const item = modifiedFields.find(({ key }) => key === x.key);
      return item ? item : x;
    });
    this.userFields = [...replacedItems, ...additionalFields];

    this.options = {
      formState: {
        readOnly: true
      },
    };
  }

  getUserField(field, html = true) {
    let index = 0;
    let result = '---';

    let wa = null;

    switch (field) {
      case 'phone':
      case 'mobile':
      case 'email':
      case 'pec':
        wa = (this.user && this.user[field]) ? this.user[field] : null;
        if (wa) {
          if (html) {
            result = '<span class="badge badge- d-none">' + field + '</span>' + ' <span class="small">' + wa + '</span>';
          } else {
            result = wa;
          }
        }
        break;

      case 'website':
        wa = (this.user && this.user[field]) ? this.user[field] : null;
        if (wa) {
          if (html) {
            result = '<a href="' + wa + '" target="_new">';
            result += '<span class="badge badge-light d-none">' + field + '</span>' + ' <span>' + wa + '</span></a>';
          } else {
            result = wa;
          }
        }
        break;
      case 'role':
        const roleId = (this.user && this.user['anagRuoloId']) ? this.user['anagRuoloId'] : 0;
        index = _.findIndex(this.roles, { id: roleId });
        result = (index !== -1) ? this.roles[index].descrizione : 'Role # ' + roleId;
        break;
      case 'aziendaId':
        const aziendaId = (this.user && this.user['aziendaId']) ? this.user['aziendaId'] : 0;
        // index = _.findIndex(this.companies, { id: aziendaId });
        index = _.findIndex(this.anagraficheCombo['SpComboAzienda'], { id: aziendaId });
        result = (index !== -1) ? this.anagraficheCombo['SpComboAzienda'][index].descrizione : 'Azienda # ' + aziendaId;
        break;
      case 'anagMansioneId':
        const mansioneId = this.user['anagMansioneId'] || 0;
        index = _.findIndex(this.anagraficheCombo['SpComboMansione'], { id: mansioneId });
        result = (index !== -1) ? this.anagraficheCombo['SpComboMansione'][index].descrizione : 'Mansione # ' + mansioneId;
        break;
      case 'magazzinoId':
        const magazzinoId = this.user['magazzinoId'] || 0;
        index = _.findIndex(this.anagraficheCombo['SpComboMagazzino'], { id: magazzinoId });
        result = (index !== -1) ? this.anagraficheCombo['SpComboMagazzino'][index].descrizione : 'Magazzino # ' + magazzinoId;
        break;
      case 'departmentId':
        const departmentId = this.user['departmentId'] || 0;
        index = _.findIndex(this.anagraficheCombo['SpComboDepartment'], { id: departmentId });
        result = (index !== -1) ? this.anagraficheCombo['SpComboDepartment'][index].descrizione : (departmentId ? 'Dipartimento # ' + departmentId : '---');
        break;
      default:
        wa = (this.user && this.user[field]) ? this.user[field] : null;
        if (wa) {
          if (html) {
            result = '<span class="small">' + wa + '</span>';
          } else {
            result = wa;
          }
        }
    }

    return result;
  }

  toggleEdit() {
    this.editing = !this.editing;
    if (this.editing) { this.initForm(); }
  }

  onDelete(confirm) {
    if (confirm) {
      this.notificationService.success('APP.MESSAGE.deletion_successful', 'APP.TITLE.users');
      // this.usersService.deleteModel(this.currentId).subscribe(
      //   (response: any) => {
      //     console.log('onDelete', response);
      //     this.refresh();
      //   },
      //   (error: any) => {
      //     console.log('onDelete error', error);
      //     this.notificationService.error('APP.MESSAGE.deletion_unsuccessful', 'APP.TITLE.users');
      //   }
      // );
    } else {
      this.notificationService.info('APP.MESSAGE.deletion_canceled', 'APP.TITLE.users');
    }
  }

  onSave(user: any) {
    this.user = <User>{ ...this.userModel };

    // Save Tenant <-> User
    this.usersService.saveUser(this.tenant, this.user).subscribe(
      (response: any) => {
        // console.log('saveUser', response);
        this.editing = false;
        this.isNew = false;

        this.notificationService.success('APP.MESSAGE.saved_message');
      }
    );

    this.editing = false;
    this.isNew = false;

    // Emit event
    this.saved.emit(this.user);
  }

  resetForm() {
    this.options.resetModel({});
  }

  modelChange(event: any) {
    // console.log('modelChange', event);
  }

  _updateMagazzini() {
    console.log('_updateMagazzini', this.userModel.aziendaId);
    const combos = [
      { name: 'SpComboMagazzino', aziendaId: this.userModel.aziendaId },
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
    setTimeout(() => {
      this.userModel.magazzinoId = 0;
    }, 1000);
  }

}
