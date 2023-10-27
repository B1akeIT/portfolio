import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class Email {
  id: number = 0;
  email: string;
  aziendaId: number = 0;
  contattoId: number = 0;
  anagDescEmailId: number;
  isEmailFatturazione: boolean = false;
  isInvioDDT: boolean = false;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
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
          },
        ]
      },
      {
        key: 'anagDescEmailId',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.anagDescEmailId',
          placeholder: 'APP.FIELD.anagDescEmailId',
          required: false
        }
      },
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.email',
          placeholder: 'APP.FIELD.email',
          required: true
        }
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'isEmailFatturazione',
            type: 'checkbox',
            templateOptions: {
              type: 'boolean',
              translate: true,
              label: 'APP.FIELD.isEmailFatturazione',
              placeholder: 'APP.FIELD.isEmailFatturazione',
              required: false
            }
          },
          {
            className: 'col-9',
            key: 'isInvioDDT',
            type: 'checkbox',
            templateOptions: {
              type: 'boolean',
              translate: true,
              label: 'APP.FIELD.isInvioDDT',
              placeholder: 'APP.FIELD.isInvioDDT',
              required: false
            }
          }
        ]
      },
    ];
  }
}
