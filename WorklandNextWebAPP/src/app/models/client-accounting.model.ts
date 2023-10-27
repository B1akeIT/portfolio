import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class ClientAccounting {
  id: number = 0;
  clienteId: number = 0;
  aziendaId: number = 0;
  filialeId: number = 0;
  email: string;
  listinoId: number = 0;
  anagIVAId: number = 0;
  dichiarazioneIntento: string;
  dichIntImporto: number = 0;
  dichIntEsposizione: number = 0;
  dataInizioInt: string;
  isPrezzoLordoIva: boolean;
  anagTipoPagamentoId: number = 0;
  anagModalitaPagamentoId: number = 0;
  referente: string;
  nFax: string;
  nTel: string;
  nCell: string;
  anagAbiId: number = 0;
  anagCabId: number = 0;
  bancaCIN: string;
  bancaCC: string;
  iban: string;
  isSplitPayment: boolean;
  importoFido: number = 0;
  dataUltimoAggiornamentoFido: string;
  utenteUltimoAggiornamentoFidoId: number = 0;
  esposizione: number = 0;
  isEsenteIVA: boolean;
  referenteCommercialeId: number = 0;
  anagPortoId: number = 0;
  referenteMaster: string;
  isSpeseIncasso: boolean;
  speseIncasso: number = 0;
  isRaggruppaOrdini: boolean;
  isRaggruppaScadenza: boolean;
  utenteReferenteId: number = 0;
  codiceGestionale: string;
  costoOrarioAnalisi: number = 0;
  costoOrarioIntervento: number = 0;
  costoOrarioIstruzione: number = 0;
  costoOrarioSviluppo: number = 0;
  costoTrasferta: number = 0;
  bancaAziendaId: number = 0;
  isAddebitareTrasferta: boolean = false;
  speseBolliSuEsenti: number = 0;
  speseImballo: number = 0;

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
      {
        key: 'codiceGestionale',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codiceGestionale',
          placeholder: 'APP.FIELD.codiceGestionale',
          required: false,
          appearance: 'legacy'
        }
      },
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
      codiceGestionale: {},
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
