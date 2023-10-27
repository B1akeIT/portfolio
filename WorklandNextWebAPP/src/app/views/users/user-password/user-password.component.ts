import { Component, OnInit, Input, OnChanges, Output, EventEmitter }	from '@angular/core';

import { FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { TranslateService } from '@ngx-translate/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent implements OnInit, OnChanges {

  @Input() principalId = null;

  @Output()
  changed: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  closed: EventEmitter<any> = new EventEmitter<any>();

  passwordForm: FormGroup;
  passwordModel: any;
  passwordFields: FormlyFieldConfig[];
  options: FormlyFormOptions;

  constructor(
    private translate: TranslateService
  ) {}

  ngOnChanges(changes: any) {
    // if (changes.tenant) {
    //   this.tenant = changes.tenant.currentValue;
    // }
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.passwordForm = new FormGroup({});
    this.passwordModel = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      isActive: true
    };
    this.passwordFields = [
      {
        validators: {
          'fieldMatch': {
            expression: (control) => {
              const value = control.value;

              return value.confirmNewPassword === value.newPassword
                || (!value.confirmNewPassword || !value.newPassword);
            },
            message: this.translate.stream('APP.FORM.VALIDATION.PASSWORD_NO_MATCHING'),
            errorPath: 'confirmNewPassword',
          },
        },
        fieldGroup: [
          {
            key: 'oldPassword',
            type: 'password',
            defaultValue: '',
            templateOptions: {
              type: 'password',
              translate: true,
              label: 'APP.FIELD.old_password',
              placeholder: 'APP.FIELD.old_password',
              required: true
            }
          },
          {
            key: 'newPassword',
            type: 'password',
            defaultValue: '',
            templateOptions: {
              type: 'password',
              translate: true,
              label: 'APP.FIELD.new_password',
              placeholder: 'APP.FIELD.new_password',
              required: true
            }
          },
          {
            key: 'confirmNewPassword',
            type: 'password',
            defaultValue: '',
            templateOptions: {
              type: 'password',
              translate: true,
              label: 'APP.FIELD.confirm_password',
              placeholder: 'APP.FIELD.confirm_password',
              required: true
            }
          }
        ]
      }
    ];

    this.options = {
      formState: {
        readOnly: true
      },
    };
  }

  closeEdit() {
    // Emit event
    this.closed.emit();
  }

  onSave(data: any) {
    // Emit event
    this.changed.emit(data);
  }

  resetForm() {
    this.options.resetModel({});
  }
}
