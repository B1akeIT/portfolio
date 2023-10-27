import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { RolesPermissionsService } from '../roles-permissions.service';

import { APP_CONST } from '@app/shared/const';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnChanges {

  @Input() role = null;
  @Input() tenant = null;
  @Input() status = 'view';

  @Output()
  save: EventEmitter<string> = new EventEmitter<string>();

  roleData = null;

  loading = false;
  loading_saving = false;
  loading_permissions = false;
  loadingOptions = APP_CONST.loadingOptions;

  error = false;
  errorMessage = '';

  roleForm: FormGroup;
  formData: any = {};

  indeterminate = false;

  companies = [];

  constructor(
    private fb: FormBuilder,
    private rolesPermissionsService: RolesPermissionsService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCompanies();
  }

  ngOnChanges(changes: any) {
    if (changes.role) {
      this.role = changes.role.currentValue;
      this.loadRoleData();
    }
    if (changes.status) {
      this.status = changes.status.currentValue;
      if (this.isNew()) {
        this.buildForm();
      }
    }
  }

  isNew() {
    return (!this.role && this.status === 'edit');
  }

  loadCompanies() {
    // this.rolesPermissionsService.getAziende().subscribe(
    this.rolesPermissionsService.getJson('companies').subscribe(
      (resp: any) => {
        this.companies = resp.data;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  loadRoleData() {
    // this.roleData = null;
    if (this.role && this.role.id) {
      this.loading = true;
      this.rolesPermissionsService.getRole(this.role.id).subscribe(
        (resp: any) => {
          this.roleData = resp;
          this.loading = false;

          this.roleForm.patchValue({
            id: this.roleData.id,
            descrizione: this.roleData.descrizione
          });
        },
        (error: any) => {
          this.roleData = null;
          this.loading = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    }
  }

  buildForm() {
    this.roleForm = this.fb.group({
      id: new FormControl(''),
      descrizione: new FormControl(''),
    });

    this.roleForm.patchValue({
      id: 0,
      descrizione: null
    });

    this.formData = this.roleForm.value;
  }

  onChange(event, field) {
    console.log('onChange', field);
  }

  onSave() {
    this.formData = this.roleForm.value;
    // console.log('onSave', this.formData);
    let saveObs = null;

    this.loading_saving = true;

    if (this.formData.id === 0) {
      saveObs = this.rolesPermissionsService.saveRole(this.formData);
    } else {
      saveObs = this.rolesPermissionsService.updateRole(this.formData.id, this.formData);
    }

    saveObs.subscribe(
      (resp: any) => {
        this.roleData = resp;
        this.loading_saving = false;

        this.status = 'view';
        this.save.emit(this.roleData);
      },
      (error: any) => {
        this.loading_saving = false;
        this.error = true;
        this.errorMessage = error.message;

        this.status = 'view';
      }
    );
  }

  onCancel() {
    this.save.emit(null);
  }
}
