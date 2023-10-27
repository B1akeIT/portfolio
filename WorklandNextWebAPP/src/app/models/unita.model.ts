import { FormlyFieldConfig } from '@ngx-formly/core';

export class Unita {
  id: number = 0;
  contattoId: number = 0;
  clienteId: number = 0;
  anagShipTypeId: number = 0;
  anagShipyardId: number = 0;
  imoNumber: string;
  lenght: string;
  grossTonnage: string;
  nameEngineMakers: string;

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
