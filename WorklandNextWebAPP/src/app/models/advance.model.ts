import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class Advance {
  id: number = 0;
  clienteContabilitaId: number;
  importo: number;
  dataPagamento: string;
  modalitaPagamentoId: number;
  preventivoTestataId: number;
  ordineClienteTestataId: number;
  statoDocumentoId: number;
  aziendaId: number;
  note: string;
  dataInsert: string;
  dataUpdate: string;
  dataDelete: string;
  utenteInsertId: number;
  utenteUpdateId: number;
  utenteDeleteId: number;
  residuo: number;
  anagModalitaPagamentoDescrizione: string;
  numeroPreventivo: number;
  dataPreventivo: string;
  numeroOrdineCliente: number;
  dataOrdineCliente: string;
  statoDocumentoDescrizione: string;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'dataInsert':
        case 'dataPreventivo':
        case 'dataUpdate':
        case 'dataDelete':
        case 'dataOrdineCliente':
          this[key] = data[key] ? moment(data[key], 'YYYY-MM-DD').format('YYYY-MM-DD') : null;
          break;
        default:
          this[key] = data[key];
          break;
      }
    });
  }

  formField() {
    return <FormlyFieldConfig[]>[];
  }

  formFieldsOptions() {
    return {};
  }
}
