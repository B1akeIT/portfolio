import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class InvoiceItem {
  id: number = 0;
  fatturaTestataId: number = 0;
  numeroRiga: number = null;
  fornitorePerArticoloId: number = null;
  articoloId: number = null;
  descrizioneArticoloPerAzienda: string = null;
  codiceArticolo: string = null;
  codiceArticoloPerCliente: string = null;
  descrizioneEN: string = null;
  link: string = null;
  descrizioneArticoloPerCliente: string = null;
  articoloVarianteId: number = null;
  categoria: string = null;
  costo: number = null;
  prezzoUnitario: number = null;
  prezzoTotale: number = null;
  prezzoTotaleLordo: number = null;
  prezzoUnitarioLordo: number = null;
  prezzoUnitarioScontato: number = null;
  sconto1: number = null;
  sconto2: number = null;
  ricaricoPercentuale: number = null;
  margine: number = null;
  fornitoreId: number = null;
  codiceFornitore: string = null;
  fornitore: string = null;
  quantita: number = null;
  quantitaScaricata: number = null;
  quantitaCaricata: number = null;
  anagIvaId: number = null;
  aliquotaIva: number = null;
  descrizioneIva: string = null;
  codiceIva: string = null;
  listinoId: number = null;
  anagUnitaDiMisuraId: number = null;
  magazzinoId: number = null;
  note: string = null;
  barCode: string = null;
  anagUdMVisualizzataId: number = null;
  numColli: number = null;
  ordineClienteDettaglioId: number = null;
  documentoDiTrasportoDettaglioId: number = null;
  isGestioneLotti: boolean = null;
  anagraficaProduttore: string = null;
  partNumber: string = null;
  barCodeDocumento: string = null;
  umVisualizzataCodice: string = null;
  anagUnitaDiMisuraCodice: number = null;
  anagIvaDescrizione: string = null;
  anagIvaAliquota: number = null;
  listinoDescrizione: string = null;
  codiceDoganale: string = null;
  isConsumabile: boolean = null;
  isPericoloso: boolean = null;
  anagNazioneOrigineId: number = null;
  anagNazioneOrigineDescrizione: string = null;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
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
