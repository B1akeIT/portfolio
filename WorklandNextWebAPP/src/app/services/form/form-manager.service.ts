import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { inputIsNotNullOrUndefined } from '@app/utils/operators';

import { Undefinable } from '@app/models/empty';

import { keys } from '@app/utils/form/utils';


export type FieldsOptions<T> = { [P in keyof T]?: FormOptions<T> };
export type FormControlType = 'array' | 'control' | 'object';
export type FormOptions<T> =
  AbstractControlOptions &
  {
    value?: any, // TODO: Avoid any, use Z instead
    disabled?: boolean,
    type?: FormControlType,
    controls?: FieldsOptions<T>,
    additionalInfo?: any, // TODO: Avoid any, use Z instead
  };

@Injectable()
export class FormManagerService {

  constructor(
    private readonly formBuilder: FormBuilder,
  ) {
  }

  makeForm<T>(fields: FieldsOptions<T>, initData?: T): FormGroup {
    const groups: Partial<Record<keyof T, FormControl | FormGroup | FormArray>> = {};
    const fieldsKeys = keys(fields);

    for (const key of fieldsKeys) {
      const keyOptions = fields[key];
      if (!keyOptions) {
        continue;
      }

      const initValue = (initData && initData[key]) ||
        (inputIsNotNullOrUndefined(keyOptions.value) ? keyOptions.value : undefined);

      const disabled = keyOptions.disabled || false;

      switch (keyOptions.type || 'control') {
        case 'control':
          groups[key] = new FormControl({ value: initValue, disabled }, keyOptions.validators, keyOptions.asyncValidators);
          break;
        case 'object':
          if (!keyOptions.controls) {
            console.warn('You are trying to create a form group without a controls info schema. Default FormControl will be generated');
            groups[key] = new FormControl({ value: initValue, disabled }, keyOptions.validators, keyOptions.asyncValidators);
            break;
          }

          groups[key] = this.makeForm(keyOptions.controls, initValue);
          break;
        case 'array':
          let controls: FormControl[] | FormGroup[];

          if (initValue instanceof Array && keyOptions.controls) {
            controls = initValue
              .map((v) => keyOptions.controls ? this.makeForm(keyOptions.controls, v) : undefined)
              .filter((v): v is FormGroup => v !== undefined);
          } else if (initValue instanceof Array && !keyOptions.controls) {
            controls = initValue.map((v) => new FormControl({ value: v, disabled }, keyOptions.validators, keyOptions.asyncValidators));
          } else {
            controls = [];
          }

          groups[key] = new FormArray(controls);
          break;
        default:
          groups[key] = new FormControl({ value: initValue, disabled }, keyOptions.validators, keyOptions.asyncValidators);
      }
    }
    return this.formBuilder.group(groups);
  }

  getControls<T>(form: FormGroup) {
    return form.controls as { [P in keyof T]: AbstractControl };
  }

  setControlsValues<T>(form: Undefinable<FormGroup>, data: T) {
    if (!form) {
      throw new Error('Cannot set forms input');
    }

    const keysValues = keys(form.controls);

    for (const key of keysValues) {
      if (form.controls && form.controls[key]) {
        (form.controls[key] as AbstractControl).setValue((data as any)[key]); // FIXME: Improve typing
      }
    }

    form.updateValueAndValidity();
  }
}
