import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

export class Supplier {
  id: number = 0;
  contattoId: number = 0;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        defaultValue: 0,
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'contattoId',
        type: 'input',
        defaultValue: 0,
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.contattoId',
          placeholder: 'APP.FIELD.contattoId',
          disabled: true,
          readonly: true,
          appearance: 'legacy'
        }
      }
    ];
  }

  formFieldsOptions() {
    return {
      id: {},
      contattoId: {}
    };
  }
}
