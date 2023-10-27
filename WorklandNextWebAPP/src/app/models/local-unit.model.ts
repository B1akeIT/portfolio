import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class LocalUnit {
  id: number = 0;
  intestazione: string;
  contattoId: number = 0;
  contattoPrincipaleId: number = 0;
  indirizzo: string;
  cAP: string;
  comune: string;
  provincia: string;
  anagNazioneId: number;
  isDefaultValue: boolean = false;

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
            key: 'contattoPrincipaleId',
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
        key: 'intestazione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.intestazione',
          placeholder: 'APP.FIELD.intestazione',
          required: true
        }
      },
      {
        key: 'indirizzo',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.indirizzo',
          placeholder: 'APP.FIELD.indirizzo',
          required: true
        }
      },
      {
        key: 'cAP',
        type: 'input',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.cap',
          placeholder: 'APP.FIELD.cap',
          required: false
        }
      },
      {
        key: 'comune',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.comune',
          placeholder: 'APP.FIELD.comune',
          required: true
        }
      },
      {
        key: 'provincia',
        type: 'input',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.provincia',
          placeholder: 'APP.FIELD.provincia',
          required: false
        }
      },
      {
        key: 'anagNazioneId',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.anagNazioneId',
          placeholder: 'APP.FIELD.anagNazioneId',
          required: false
        }
      },
      {
        key: 'isDefaultValue',
        type: 'checkbox',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isDefault',
          placeholder: 'APP.FIELD.isDefault',
          required: false
        }
      },
    ];
  }
}
