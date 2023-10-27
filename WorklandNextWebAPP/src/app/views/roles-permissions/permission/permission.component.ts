import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { PermissionService } from './permission.service';

import { APP_CONST } from '@app/shared/const';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit, OnChanges {

  @Input() permission = null;
  @Input() tenant = '';
  @Input() owner = true;
  @Input() status = 'view';
  @Input() grid = true;

  permissionData = null;

  loading = false;
  loading_saving = false;
  loadingOptions = APP_CONST.loadingOptions;

  error = false;
  errorMessage = '';

  permissionForm: FormGroup;
  formData: any = {};

  indeterminate = false;

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.tenant) {
      this.tenant = changes.tenant.currentValue;
      this.permissionService.setTenent(this.tenant);
    }
    if (changes.permission) {
      this.permission = changes.permission.currentValue;
      this.permissionData = this.permission;
      this.permissionForm.patchValue(this.permissionData);
      // this.loadPermissionData();
    }
    if (changes.status) {
      this.status = changes.status.currentValue;
      if (this.isNew()) {
        this.buildForm();
      }
    }
  }

  isNew() {
    return (!this.permission && this.status === 'edit');
  }

  loadPermissionData() {
    // this.permissionData = null;
    if (this.permission && this.permission.id) {
      this.loading = true;
      this.permissionService.getPermission(this.permission.id).subscribe(
        (resp: any) => {
          this.permissionData = resp;
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    }
  }

  getFunctionField(field) {
    return (this.permissionData?.funzioneXazienda?.funzione[field] ?? `<${field}>`);
  }

  buildForm() {
    this.permissionForm = this.fb.group({
      id: new FormControl(''),
      anagRuoloId: new FormControl(''),
      anagAutorizzazioneId: new FormControl(''),
      funzioneXAziendaId: new FormControl(''),
      grant_view_owner: new FormControl(''),
      grant_edit_owner: new FormControl(''),
      grant_create_owner: new FormControl(''),
      grant_delete_owner: new FormControl(''),
      grant_print_owner: new FormControl(''),
      grant_view_other: new FormControl(''),
      grant_edit_other: new FormControl(''),
      grant_create_other: new FormControl(''),
      grant_delete_other: new FormControl(''),
      grant_print_other: new FormControl('')
    });

    this.permissionForm.patchValue({
      id: 0,
      anagRuoloId: 0,
      anagAutorizzazioneId: 0,
      funzioneXAziendaId: 0,
      grant_view_owner: false,
      grant_edit_owner: false,
      grant_create_owner: false,
      grant_delete_owner: false,
      grant_print_owner: false,
      grant_view_other: false,
      grant_edit_other: false,
      grant_create_other: false,
      grant_delete_other: false,
      grant_print_other: false
    });

    this.formData = this.permissionForm.value;
  }

  onChange(event, field) {
    console.log('onChange', field);
  }

  onSave() {
    this.formData = this.permissionForm.value;
    // console.log('onSave', this.formData);
    let saveObs = null;

    this.loading_saving = true;

    if (this.formData.id === 0) {
      saveObs = this.permissionService.savePermission(this.formData);
    } else {
      saveObs = this.permissionService.updatePermission(this.formData.id, this.formData);
    }

    saveObs.subscribe(
      (resp: any) => {
        // this.permissionData = resp; // Check return value
        this.loading_saving = false;

        this.status = 'view';
      },
      (error: any) => {
        this.loading_saving = false;
        this.error = true;
        this.errorMessage = error.message;

        this.status = 'view';
      }
    );
  }
}
