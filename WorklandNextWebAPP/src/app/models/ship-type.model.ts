import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

export class ShipTypePrincipal {
    id: number=0;
    codice: string; 
    descrizione: string;

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
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        }
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
          required: true
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'email',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
          required: false
        }
      }
    ];
  }
}

export class ShipType {
    id: number=0;
    codice: string; 
    descrizione: string;

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
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.id',
              placeholder: 'APP.FIELD.id',
              disabled: true,
              readonly: true
            }
          },
          {
            key: 'codice',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.codice',
              placeholder: 'APP.FIELD.codice',
              required: true
            }
          },
          {
            key: 'descrizione',
            type: 'input',
            templateOptions: {
              type: 'email',
              translate: true,
              label: 'APP.FIELD.descrizione',
              placeholder: 'APP.FIELD.descrizione',
              required: false
            }
          }
    ];
  }
}
