import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class Client {
  id: number = 0;
  contattoId: number = 0;
  codDestinatarioFattElettr: string;
  // codiceGestionale: string;
  anagTipoClienteId: number;
  isBloccato: boolean = false;
  aziendaBloccoId: number;
  dataBlocco: string;
  isImportazioneTemporanea: boolean = false;
  dataInizioImportazioneTemp: string;
  dataFineImportazioneTemp: string;
  isNuovaCostruzione: boolean = false;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'dataInizioImportazioneTemp':
        case 'dataFineImportazioneTemp':
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
        key: 'anagTipoClienteId',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.tipoCliente',
          placeholder: 'APP.FIELD.anagTipoClienteId',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'codDestinatarioFattElettr',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codDestinatarioFattElettr',
          placeholder: 'APP.FIELD.codDestinatarioFattElettr',
          required: false,
          appearance: 'legacy'
        }
      },
      // {
      //   key: 'codiceGestionale',
      //   type: 'input',
      //   defaultValue: '',
      //   templateOptions: {
      //     type: 'text',
      //     translate: true,
      //     label: 'APP.FIELD.codiceGestionale',
      //     placeholder: 'APP.FIELD.codiceGestionale',
      //     required: false,
      //     appearance: 'legacy'
      //   }
      // },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'isBloccato',
            type: 'checkbox',
            defaultValue: '',
            templateOptions: {
              type: 'boolean',
              translate: true,
              label: 'APP.FIELD.isBloccato',
              placeholder: 'APP.FIELD.isBloccato',
              required: false,
              appearance: 'legacy'
            }
          },
          {
            key: 'isNuovaCostruzione',
            type: 'checkbox',
            defaultValue: '',
            templateOptions: {
              type: 'boolean',
              translate: true,
              label: 'APP.FIELD.isNuovaCostruzione',
              placeholder: 'APP.FIELD.isNuovaCostruzione',
              required: false,
              appearance: 'legacy'
            }
          },
        ]
      },
      {
        key: 'isImportazioneTemporanea',
        type: 'checkbox',
        defaultValue: '',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isImportazioneTemporanea',
          placeholder: 'APP.FIELD.isImportazioneTemporanea',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'dataInizioImportazioneTemp',
            type: 'input',
            templateOptions: {
              type: 'date',
              translate: true,
              label: 'APP.FIELD.dataInizioImportazioneTemp',
              placeholder: 'APP.FIELD.dataInizioImportazioneTemp',
              required: false
            }
          },
          {
            className: 'col-6',
            key: 'dataFineImportazioneTemp',
            type: 'input',
            templateOptions: {
              type: 'date',
              translate: true,
              label: 'APP.FIELD.dataFineImportazioneTemp',
              placeholder: 'APP.FIELD.dataFineImportazioneTemp',
              required: false
            }
          }
        ]
      },
    ];
  }

  formFieldsOptions() {
    return {
      id: {},
      contattoId: {},
      codDestinatarioFattElettr: {},
      // codiceGestionale: {},
      anagTipoClienteId: {},
      aziendaBloccoId: {},
      isBloccato: {},
      dataBlocco: {},
      isImportazioneTemporanea: {},
      dataFineImportazioneTemp: {},
      dataInizioImportazioneTemp: {},
      isNuovaCostruzione: {}
    };
  }
}
