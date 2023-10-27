import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class OrderItem {
  id: number = 0;
  ordineClienteTestataId: number = 0;
  preventivoTestataId: number = 0;
  preventivoDettaglioId: number = 0;
  ordineFornitoreTestataId: number = 0;
  numeroRiga: number = null;
  codiceArticolo: string = null;
  descrizioneEN: string = null;
  anagraficaProduttore: string = null;
  partNumber: string = null;
  descrizioneArticoloPerAzienda: string = null;
  descrizione: string = null;
  quantita: number = null;
  costo: number = null;
  ricaricoPercentuale: number = null;
  prezzoUnitario: number = null;
  fornitore: string = null;
  codiceFornitore: string = null;
  link: string = null;
  sconto1: number = null;
  codiceIva: string = null;
  prezzoUnitarioScontato: number = null;
  anagUnitaDiMisuraId: number = null;
  anagUDMVisualizzataId: number = null;
  prezzoTotale: number = null;
  prezzoTotaleLordo: number = null;
  margine: number = null;
  isEscludiInStampa: boolean = null;
  isEscludiDalTotale: boolean = null;
  numColli: number = null;
  statoInviato: string = null;
  statoAccettato: string = null;
  statoOrdinato: string = null;
  statoArrivato: string = null;
  statoEvaso: string = null;
  statoFatturato: string = null;
  statoRifiutato: string = null;
  note: string = null;
  codiceArticoloPerCliente: string = null;
  descrizioneArticoloPerCliente: string = null;
  aggregaInStampa: boolean = null;
  barCodeDocumento: string = null;
  articoloId: number = null;
  riferimentoDocumento: string = null;
  barCode: string = null;
  quantitaEvasa: number = null;
  quantitaScaricata: number = null;
  quantitaPreparata: number = null;
  quantitaCaricata: number = null;
  quantitaInLavorazione: number = null;
  qtaDaConsAttuale: number = null;
  qtaPreparataAttuale: number = null;
  qtaPLAttuale: number = null;
  fornitoreId: number = null;
  listinoId: number = null;
  sconto2: number = null;
  anagIvaId: number = null;
  aliquotaIva: number = null;
  descrizioneIva: string = null;
  statoDocumentoId: number = null;
  descrizioneRifiuto: string = null;
  categoria: string = null;
  magazzinoId: number = null;
  isGestioneLotti: boolean = null;
  dataScadenza: string = null;
  articoloVarianteId: number = null;
  disponibile: number = null;
  isSelectedForOuterOperations: boolean = null;
  dataInsert: string = null;
  dataUpdate: string = null;
  dataDelete: string = null;
  utenteInsertId: number = null;
  utenteUpdateId: number = null;
  utenteDeleteId: number = null;
  uMVisualizzataCodice: string = null;
  anagUnitaDiMisuraCodice: string = null;
  anagIVADescrizione: string = null;
  anagIvaAliquota: string = null;
  listinoDescrizione: string = null;
  isConsumabile: boolean = null;
  isPericoloso: boolean = null;
  codiceDoganale: string = null;
  anagNazioneOrigineId: number = null;
  anagNazioneOrigineDescrizione: string = null;
  quantitaOrdinataAFornitore: number = null;
  quantitaDaEvadere: number = null;
  quantitaEvasione: number = null;
  quantitaMultipla: number = null;
  fornitorePerArticoloId: number = null;
  codiceArticoloPerAzienda: string = null;

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
