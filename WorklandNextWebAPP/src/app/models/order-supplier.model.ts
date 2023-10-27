import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class OrderSupplier {
  id: number = 0;
  aziendaId: number;
  tipoDocumentoId: number;
  tipoDocumentoDescrizione: string;
  numero: number;
  dataCreazione: string;
  dataScadenza: string;
  statoDocumentoId: number;
  statoDocumentoDescrizione: string;
  ordineFornitoreProvenienzaId: number;
  fornitoreIntestatarioId: number;
  clienteIntestatarioId: number;
  contattoIntestatarioId: number;
  nominativoIntestatario: string;
  indirizzoIntestatario: string;
  capIntestatario: string;
  comuneIntestatario: string;
  provinciaIntestatario: string;
  nazioneIntestatario: string;
  nazioneIntestatarioId: number;
  isNazioneIntestatarioComunitaria: boolean;
  anagTipoClienteId: number;
  anagTipoClienteDescrizione: string;
  contattoDestinazioneId: number;
  nominativoDestinazione: string;
  indirizzoDestinazione: string;
  capDestinazione: string;
  comuneDestinazione: string;
  provinciaDestinazione: string;
  nazioneDestinazione: string;
  nazioneDestinazioneId: number;
  isNazioneDestinazioneComunitaria: boolean;
  clienteProprietarioId: string;
  nominativoProprietario: number;
  pIVA: string;
  codiceFiscale: string;
  anagLinguaId: number;
  anagLinguaDescrizione: string;
  totaleNetto: number;
  totaleMargine: number;
  totaleIvaAzienda: number;
  totaleIva: number;
  totaleNettoAzienda: number;
  totaleLordoAzienda: number;
  totaleLordo: number;
  totaleMerce: number;
  costoTrasportoValore: number;
  costoTrasportoPercentuale: number;
  costoTrasportoValoreAzienda: number;
  costoTrasportoPercentualeRicarico: number;
  trasportoTotale: number;
  costoImballoValore: number;
  costoImballoPercentuale: number;
  imballoTotale: number;
  scontoValore: number;
  scontoPercentuale: number;
  totaleSconto: number;
  isEsenteIva: boolean;
  anagIvaId: number;
  anagIVACodice: string;
  anagIVADescrizione: string;
  iva: any; // NO
  ivaTrasportoId: number;
  anagIVACodiceTrasporto: string;
  ivaImballoId: number;
  anagIVACodiceImballo: string;
  doganaCustom: string;
  ivaDoganaCustomId: number;
  ivaDoganaCustom: any; // NO
  anagIVACodiceDogana: string;
  anagValutaId: number;
  anagValutaDescrizione: string;
  cambio: number;
  totaleInValuta: number;
  valutaDiRedazioneId: number;
  anagValutaDescrizioneDiRedazione: string;
  extraFido: boolean; // NO
  importoExtra: number; // NO
  noteInterne: string;
  idMyVss: number; // NO
  utenteCarrello: string; // NO
  sospeso: boolean; // NO
  speseIncassoValore: number;
  speseIncassoPercentuale: number;
  speseIncassoTotale: number;
  ivaSpeseDiIncassoId: number;
  anagIVACodiceSpeseDiIncasso: string;
  riferimentoCliente: string;
  anagTipoPagamentoId: number;
  anagTipoPagamentoDescrizione: string;
  categoriaDocumentoId: number;
  categoriaDocumentoDescrizione: string;
  listinoId: number;
  listinoDescrizione: string;
  riferimentoCommercialeId: number;
  riferimentoCommerciale: string;
  vettoreId: number;
  nominativoVettore: string;
  indirizzoVettore: string;
  capVettore: string;
  comuneVettore: string;
  provinciaVettore: string;
  nazioneVettore: string;
  nazioneVettoreId: number;
  dichiarazioneIntento: string;
  altreSpese: number;
  bolliSuEffetti: number;
  bolliSuEsenti: number;
  ivaBolliSuEffettiId: number;
  ivaBolliSuEsentiId: number;
  ivaAltreSpeseId: number; // NO
  anagIVACodiceAltreSpese: string;
  sezionaleId: number;
  responsabile: string;
  dataPrevistaEvasione: string;
  isNoExportAltroSistema: boolean; // NO
  ubicazioneMagazzinoDefault: string; // NO
  isRinnovoAutomatico: boolean; // NO
  magazzinoId: number;
  unitaId: number;
  anagDepartmentId: number;
  anagDepartmentDescrizione: string;
  ivaSpeseId: number;
  anagIvaAltreSpeseId: number;
  anagValutazioneColore: string;
  anagValutazioneDescrizione: string;
  anagValutazioneIsEvidenzia: boolean;
  isReadOnly: boolean;
  macroCategoriaPerStampa: string;
  documentoCopiatoDa: string;
  documentoCopiatoIn: string;
  esenzioneId: number;
  abbonamentoVettore: string;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'dataCreazione':
        case 'dataScadenza':
        case 'dataPrevistaEvasione':
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
