import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class Reference {
  id: number = 0;
  contattoId: number = 0;
  riferimentoContattoId: number;
  note: string;
  dataFine: string;
  dataCreazione: string;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'dataFine':
        case 'dataCreazione':
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
      // {
      //   key: 'contattoId',
      //   type: 'input',
      //   defaultValue: 0,
      //   templateOptions: {
      //     type: 'text',
      //     translate: true,
      //     label: 'APP.FIELD.contattoId',
      //     placeholder: 'APP.FIELD.contattoId',
      //     disabled: true,
      //     readonly: true,
      //     appearance: 'legacy'
      //   }
      // },
      {
        key: 'note',
        type: 'textarea',
        templateOptions: {
          type: 'text',
          rows: 5,
          translate: true,
          label: 'APP.FIELD.note',
          placeholder: 'APP.FIELD.note',
          required: false
        }
      },
      // {
      //   fieldGroupClassName: 'row',
      //   fieldGroup: [
      //     {
      //       className: 'col-6',
      //       key: 'dataFine',
      //       type: 'input',
      //       defaultValue: null,
      //       templateOptions: {
      //         type: 'date',
      //         translate: true,
      //         label: 'APP.FIELD.dataFine',
      //         placeholder: 'APP.FIELD.dataFine',
      //         required: true
      //       }
      //     },
      //     {
      //       className: 'col-6',
      //       key: 'dataCreazione',
      //       type: 'input',
      //       defaultValue: null,
      //       templateOptions: {
      //         type: 'date',
      //         translate: true,
      //         label: 'APP.FIELD.dataCreazione',
      //         placeholder: 'APP.FIELD.dataCreazione',
      //         required: true
      //       }
      //     }
      //   ]
      // }
    ];
  }
}
