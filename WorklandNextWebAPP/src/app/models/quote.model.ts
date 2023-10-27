import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class Quote {
  id: number = 0;
  anagDepartmentDescrizione: string;
  anagDepartmentId: number;
  anagIVACodiceDogana: string;
  anagIVACodiceImballo: string;
  anagIVACodiceSpeseDiIncasso: string;
  anagIVACodiceTrasporto: string;
  anagIVADescrizione: string;
  anagIvaId: number;
  anagLinguaDescrizione: string;
  anagLinguaId: number;
  anagTipoClienteDescrizione: string;
  anagTipoClienteId: number;
  anagTipoPagamentoDescrizione: string;
  anagTipoPagamentoId: number;
  anagValutaDescrizione: string;
  anagValutaDescrizioneDiRedazione: string;
  anagValutaId: number;
  aziendaId: number;
  cambio: number;
  capDestinazione: string;
  capFatturazione: string;
  capIntestatario: string;
  categoriaDocumentoDescrizione: string;
  categoriaDocumentoId: number;
  clienteFatturazioneId: number;
  clienteIntestatarioId: number;
  clienteProprietarioId: number;
  codiceFiscale: string;
  comuneDestinazione: string;
  comuneFatturazione: string;
  comuneIntestatario: string;
  contattoDestinazioneId: number;
  contattoFatturazioneId: number;
  contattoIntestatarioId: number;
  costoImballoPercentuale: number;
  costoImballoValore: number;
  costoTrasportoPercentuale: number;
  costoTrasportoPercentualeRicarico: number;
  costoTrasportoValore: number;
  costoTrasportoValoreAzienda: number;
  dataCreazione: string;
  dataScadenza: string;
  doganaCustom: string;
  extraFido: boolean;
  idMyVss: number;
  imballoTotale: number;
  importoExtra: number;
  indirizzoDestinazione: string;
  indirizzoFatturazione: string;
  indirizzoIntestatario: string;
  isEsenteIva: boolean;
  isNazioneDestinazioneComunitaria: boolean;
  isNazioneFatturazioneComunitaria: boolean;
  isNazioneIntestatarioComunitaria: boolean;
  isReadOnnly: boolean = false; // NUOVO CAMPO
  isStessoFatturazione: boolean;
  ivaDoganaCustomId: number;
  ivaImballoId: number;
  ivaSpeseDiIncassoId: number;
  ivaTrasportoId: number;
  listinoDescrizione: string;
  listinoId: number;
  nazioneDestinazione: string;
  nazioneDestinazioneId: number;
  nazioneFatturazione: string;
  nazioneFatturazioneId: number;
  nazioneIntestatario: string;
  nazioneIntestatarioId: number;
  nominativoDestinazione: string;
  nominativoFatturazione: string;
  nominativoIntestatario: string;
  nominativoProprietario: string;
  noteInterne: string;
  noteTestata1: string;
  noteTestata2: string;
  numero: number;
  piva: string;
  provinciaDestinazione: string;
  provinciaFatturazione: string;
  provinciaIntestatario: string;
  referente: string;
  responsabile: string;
  riferimentoCliente: string;
  riferimentoCommerciale: string;
  riferimentoCommercialeId: number;
  scontoPercentuale: number;
  scontoValore: number;
  sezione1DopoCorpo: string;
  sezione2DopoCorpo: string;
  sospeso: boolean;
  speseIncassoPercentuale: number;
  speseIncassoTotale: number;
  speseIncassoValore: number;
  statoDocumentoDescrizione: string;
  statoDocumentoId: number;
  tipoDocumentoDescrizione: string;
  tipoDocumentoId: number;
  titolo: string;
  totaleInValuta: number;
  totaleIva: number;
  totaleIvaAzienda: number;
  totaleLordo: number;
  totaleLordoAzienda: number;
  totaleMargine: number;
  totaleMerce: number;
  totaleNetto: number;
  totaleNettoAzienda: number;
  totaleSconto: number;
  trasportoTotale: number;
  unitaId: number;
  utenteCarrello: string;
  valutaDiRedazioneId: number;
  vettoreId: number;
  nominativoVettore: string;
  indirizzoVettore: string;
  comuneVettore: string;
  provinciaVettore: string;
  capVettore: string;
  nazioneVettore: string;
  nazioneVettoreId: number;
  isNoExportAltroSistema: boolean;
  documentoCopiatoDa: string;
  documentoCopiatoIn: string;
  abbonamentoVettore: string;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'dataCreazione':
        case 'dataScadenza':
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
