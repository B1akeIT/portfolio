import { FormlyFieldConfig } from '@ngx-formly/core';

export class Tenant {
  id: number = 0;
  nomeConnessione: string;
  dbName: string;
  stringaConnessione: string;

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
        key: 'nomeConnessione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.name',
          placeholder: 'APP.FIELD.name',
          required: true
        }
      },
      {
        key: 'dbName',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.dbName',
          placeholder: 'APP.FIELD.dbName',
          required: true
        }
      },
      {
        key: 'stringaConnessione',
        type: 'textarea',
        templateOptions: {
          type: 'text',
          rows: 5,
          translate: true,
          label: 'APP.FIELD.stringaConnessione',
          placeholder: 'APP.FIELD.stringaConnessione',
          required: true
        }
      }
    ];
  }
}
