import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class CreditCard {
  id: number = 0;
  clienteContabilitaId: number = 0;
  intestatarioCC: string;
  tipoCC: string;
  numeroCC: string;
  dataScadenzaCC: string;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'dataScadenzaCC':
          this[key] = data[key] ? moment(data[key], 'YYYY-MM-DD').format('YYYY-MM-DD') : null;
          break;
        default:
          this[key] = data[key];
          break;
      }
    });
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'intestatarioCC',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.intestatarioCC',
          placeholder: 'APP.FIELD.intestatarioCC',
          required: true
        }
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-3',
            key: 'tipoCC',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.tipoCC',
              placeholder: 'APP.FIELD.tipoCC',
              required: false
            }
          },
          {
            className: 'col-9',
            key: 'numeroCC',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.numeroCC',
              placeholder: 'APP.FIELD.numeroCC',
              required: true
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'dataScadenzaCC',
            type: 'input',
            templateOptions: {
              type: 'date',
              translate: true,
              label: 'APP.FIELD.dataScadenzaCC',
              placeholder: 'APP.FIELD.dataScadenzaCC',
              required: true
            }
          }
        ]
      },
    ];
  }
}
