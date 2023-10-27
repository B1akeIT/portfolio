import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class Scadenza {
  id: number = 0;
  fatturaTestataId: number = 0;
  importo: number;
  data: string;
  anagModalitaPagamentoId: number;
  anagModalitaPagamentoDescrizione: string;
  statoDocumentoId: number;
  statoDocumentoDescrizione: number;
  codiceABI: string;
  anagABIDescrizione: string;
  codiceCAB: string;
  anagCABDescrizione: string;
  dataPagamento: string;
  note: string;
  isManuale: boolean;
  isStampaInFattura: boolean;
  dataInsert: string;
  dataUpdate: string;
  dataDelete: string;
  utenteInsertId: number;
  utenteUpdateId: number;
  utenteDeleteId: number;
  numero: number;
  dataCreazione: string;
  totaleLordo: number;
  anagTipoPagamentoId: number;
  anagTipoPagamentoDescrizione: string;
  nominativoFatturazione: string;
  bancaAziendaId: number;
  bancaAziendaDescrizione: string;
  IBANAzienda: string;

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
            key: 'fatturaTestataId',
            type: 'input',
            defaultValue: 0,
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.fatturaTestataId',
              placeholder: 'APP.FIELD.fatturaTestataId',
              disabled: true,
              readonly: true,
              appearance: 'legacy'
            }
          },
        ]
      },
      {
        key: 'anagModalitaPagamentoId',
        type: 'input',
        defaultValue: 0,
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.anagModalitaPagamentoId',
          placeholder: 'APP.FIELD.anagModalitaPagamentoId',
          disabled: false,
          readonly: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'importo',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.importo',
          placeholder: 'APP.FIELD.importo',
          required: true
        }
      },
      {
        key: 'data',
        type: 'input',
        templateOptions: {
          type: 'date',
          translate: true,
          label: 'APP.FIELD.data',
          placeholder: 'APP.FIELD.data',
          required: true
        }
      },
      {
        key: 'statoDocumentoId',
        type: 'input',
        defaultValue: 0,
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.statoDocumentoId',
          placeholder: 'APP.FIELD.statoDocumentoId',
          disabled: false,
          readonly: false,
          appearance: 'legacy'
        }
      },
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
    ];
  }
}
