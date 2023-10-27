import { Component } from '@angular/core';
import { Validators, FormControl, ValidationErrors } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

export function applyEmailValidation(field: FormlyFieldConfig) {
  if (
    !field.templateOptions
    || field.templateOptions.type !== 'email'
    || (field.validators && field.validators.email)
  ) {
    return;
  }
  if (field.validators && field.validators.email) {
    return;
  }

  field.validators = field.validators || {};
  field.validators.email = {
    expression: control => !control.value ? true : !Validators.email(control),
    message: `This value is not a valid email.`,
  };
}
