import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

export class Warehouse {
  id: number = 0;
  aziendaId: number = 0;
  denominazione: string;
  indirizzo: string;
  comune: string;
  cap: string;
  provincia: string;
  anagNazioneId: number = 0;
  email: string;
  nTel: string;
  nCell: string;
  nFax: string;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  formField() {
    return <FormlyFieldConfig[]>[
      // {
      //   fieldGroupClassName: 'row',
      //   fieldGroup: [
      //     {
      //       className: 'col-6',
      //       key: 'id',
      //       type: 'input',
      //       templateOptions: {
      //         type: 'text',
      //         translate: true,
      //         label: 'APP.FIELD.id',
      //         placeholder: 'APP.FIELD.id',
      //         disabled: true,
      //         readonly: true
      //       }
      //     },
      //     {
      //       className: 'col-6',
      //       key: 'aziendaId',
      //       type: 'input',
      //       templateOptions: {
      //         type: 'text',
      //         translate: true,
      //         label: 'APP.FIELD.aziendaId',
      //         placeholder: 'APP.FIELD.aziendaId',
      //         required: false,
      //         disabled: true,
      //         readonly: true
      //       }
      //     },
      //   ]
      // },
      {
        key: 'denominazione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.denominazione',
          placeholder: 'APP.FIELD.denominazione',
          required: true
        }
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-12',
            key: 'indirizzo',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.indirizzo',
              placeholder: 'APP.FIELD.indirizzo',
              required: true
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-2',
            key: 'cap',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.cap',
              placeholder: 'APP.FIELD.cap',
              required: false
            }
          },
          {
            className: 'col-8',
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
            className: 'col-2',
            key: 'provincia',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.provincia',
              placeholder: 'APP.FIELD.provincia',
              required: false
            }
          },
        ]
      },
      {
        name: 'anagNazioneId',
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'anagNazioneId',
            type: 'input',
            templateOptions: {
              type: 'number',
              translate: true,
              label: 'APP.FIELD.anagNazioneId',
              placeholder: 'APP.FIELD.anagNazioneId',
              required: false
            }
          },
        ]
      },
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.email',
          placeholder: 'APP.FIELD.email',
          required: false
        }
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-4',
            key: 'nTel',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.nTel',
              placeholder: 'APP.FIELD.nTel',
              required: false
            }
          },
          {
            className: 'col-4',
            key: 'nCell',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.nCell',
              placeholder: 'APP.FIELD.nCell',
              required: false
            }
          },
          {
            className: 'col-4',
            key: 'nFax',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.nFax',
              placeholder: 'APP.FIELD.nFax',
              required: false
            }
          },
        ]
      }
    ];
  }
}
