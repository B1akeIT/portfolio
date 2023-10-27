import { FormlyFieldConfig } from '@ngx-formly/core';

import * as moment from 'moment';

export class SupplierAccounting {
  id: number = 0;
  fornitoreId: number = 0;
  aziendaId: number = 0;
  anagIVAId: number = 0;
  dataInizioInt: string;
  dataUltimoAggiornamentoFido: string;
  dichIntEsposizione: number = 0;
  dichIntImporto: number = 0;
  dichiarazioneIntento: string;
  importoFido: number = 0;
  isCaricaQuantitaMaggiore: boolean = false;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'dataInizioInt':
        case 'dataUltimoAggiornamentoFido':
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
        key: 'fornitoreId',
        type: 'input',
        defaultValue: 0,
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.fornitoreId',
          placeholder: 'APP.FIELD.fornitoreId',
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
