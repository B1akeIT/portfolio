import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class QuoteItem {
  id: number = 0;
  preventivoTestataId: number = 0;
  fornitorePerArticoloId: number = null;
  numeroRiga: number = null; // #1
  codiceArticolo: string = null; // #2
  descrizioneEN: string = null; // #3
  anagraficaProduttore: string = null; // #4
  partNumber: string = null; // #5
  descrizioneArticoloPerAzienda: string = null; // #6 -
  descrizione: string = null; // #6 ?
  quantita: number = null; // #7 -
  costo: number = null; // #8 -
  ricaricoPercentuale: number = null; // #9 -
  prezzoUnitario: number = null; // #10 -
  fornitore: string = null; // #11
  codiceFornitore: string = null; // #12
  link: string = null; // #13
  sconto1: number = null; // #14 -
  codiceIva: string = null; // #15 -
  prezzoUnitarioScontato: number = null; // #16 -
  anagUnitaDiMisuraId: number = null; // #17
  anagUDMVisualizzataId: number = null; // #18
  prezzoTotale: number = null; // #19 -
  margine: number = null; // #20 -
  // costoUltimo: number = null; // #21
  isEscludiInStampa: boolean = null; // #22
  isEscludiDalTotale: boolean = null; // #23
  numColli: number = null; // #24
  statoInviato: string = null; // #25
  statoAccettato: string = null; // #26
  statoOrdinato: string = null; // #27
  statoArrivato: string = null; // #28
  statoEvaso: string = null; // #29
  statoFatturato: string = null; // #30
  statoRifiutato: string = null; // #31
  note: string = null; // #32
  codiceArticoloPerCliente: string = null; // #33
  descrizioneArticoloPerCliente: string = null; // #34
  aggregaInStampa: boolean = null; // #35
  barCodeDocumento: string = null; // #36
  articoloId: number = null;
  riferimentoDocumento: string = null;
  barCode: string = null;
  quantitaEvasa: number = null;
  quantitaScaricata: number = null;
  fornitoreId: number = null;
  listinoId: number = null;
  sconto2: number = null;
  anagIvaId: number = null;
  aliquotaIva: number = null;
  descrizioneIva: string = null;
  statoDocumentoId: number = null;
  descrizioneRifiuto: string = null;
  categoria: string = null;
  codiceDoganale: string = null;
  isConsumabile: boolean = null;
  isPericoloso: boolean = null;
  anagNazioneOrigineId: number = null;
  anagNazioneOrigineDescrizione: string = null;
  dataInsert: string = null;
  dataUpdate: string = null;
  dataDelete: string = null;
  utenteInsertId: number = null;
  utenteUpdateId: number = null;
  utenteDeleteId: number = null;
  articoloVarianteId: number = null;
  uMVisualizzataCodice: string = null;
  anagUnitaDiMisuraCodice: string = null;
  anagIvaDescrizione: string = null;
  anagIvaAliquota: string = null;
  listinoDescrizione: string = null;
  statoDocumentoDescrizione: string = null;
  isReadOnly: boolean = false;
  quantitaOrdinabile: number = null;
  quantitaMultipla: number = null;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'statoOrdinato':
        case 'statoArrivato':
        case 'statoEvaso':
        case 'statoFatturato':
        case 'statoAccettato':
        case 'statoInviato':
        case 'statoRifiutato':
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
