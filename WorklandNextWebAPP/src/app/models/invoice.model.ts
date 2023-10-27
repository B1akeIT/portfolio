import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class Invoice {
  id: number = 0;
  altreSpese: number;
  anagCausaleTrasportoId: number;
  anagDepartmentDescrizione: string;
  anagDepartmentId: number;
  anagIVACodice: number;
  anagIVACodiceAltreSpese: string;
  anagIVACodiceDogana: number;
  anagIVACodiceImballo: number;
  anagIVACodiceSpeseDiIncasso: number;
  anagIVACodiceTrasporto: number;
  anagIVADescrizione: string;
  anagIvaId: number;
  anagLinguaDescrizione: string;
  anagLinguaId: number;
  anagPortoDescrizione: string;
  anagPortoId: number;
  anagTipoClienteDescrizione: string;
  anagTipoClienteId: number;
  anagTipoPagamentoDescrizione: string;
  anagTipoPagamentoId: number;
  anagTrasportoACuraDelId: number;
  anagUDMPesoDescrizione: string;
  anagUDMPesoId: number;
  anagValutaDescrizione: string;
  anagValutaDescrizioneDiRedazione: number;
  anagValutaId: number;
  anagValutazioneColore: string;
  anagValutazioneDescrizione: string;
  anagValutazioneIsEvidenzia: number;
  aspettoEsterioreArticoloId: number;
  aziendaId: number;
  bancaAziendaDescrizione: string;
  bancaAziendaId: number;
  bolliSuEffetti: number;
  bolliSuEsenti: number;
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
  comuneVettore: string;
  contattoDestinazioneId: number;
  contattoFatturazioneId: number;
  contattoIntestatarioId: number;
  costoImballoPercentuale: number;
  costoImballoValore: number;
  costoTrasportoPercentuale: number;
  costoTrasportoValore: number;
  dataCreazione: string;
  dataInizioTrasporto: string;
  dataScadenza: string;
  dichiarazioneIntento: string;
  doganaCustom: number;
  ibanAzienda: string;
  imballoTotale: number;
  indirizzoDestinazione: string;
  indirizzoFatturazione: string;
  indirizzoIntestatario: string;
  isEsenteIva: number;
  isNazioneDestinazioneComunitaria: boolean;
  isNazioneFatturazioneComunitaria: boolean;
  isNazioneIntestatarioComunitaria: boolean;
  isNoExportAltroSistema: boolean;
  isPrezzoLordoIva: boolean;
  isReadOnly: boolean;
  isStessoFatturazione: boolean;
  ivaAltreSpeseId: number;
  ivaBolliSuEffettiId: number;
  ivaBolliSuEsentiId: number;
  ivaDoganaCustomId: number;
  ivaImballoId: number;
  ivaSpeseDiIncassoId: number;
  ivaTrasportoId: number;
  latitudineDestinazione: string;
  listinoDescrizione: string;
  listinoId: number;
  longitudineDestinazione: string;
  magazzinoId: number;
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
  nominativoVettore: string;
  note: string;
  noteInterne: string;
  numero: number;
  numeroColli: number;
  numeroLetteraDiVettura: string;
  peso: number;
  pIVA: string;
  provinciaDestinazione: string;
  provinciaFatturazione: string;
  provinciaIntestatario: string;
  provinciaVettore: string;
  responsabile: string;
  riferimentoCliente: string;
  riferimentoCommerciale: number;
  riferimentoCommercialeId: number;
  scontoPercentuale: number;
  scontoValore: number;
  sezionaleDescrizione: string;
  sezionaleId: number;
  speseIncassoPercentuale: number;
  speseIncassoTotale: number;
  speseIncassoValore: number;
  statoDocumentoDescrizione: string;
  statoDocumentoId: number;
  tipoDocumentoDescrizione: string;
  tipoDocumentoId: number;
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
  ubicazioneMagazzinoDefault: string;
  unitaId: number;
  valutaDiRedazioneId: number;
  vettoreId: number;
  costoTrasportoValoreAzienda: number;
  costoTrasportoPercentualeRicarico: number;
  isModSpeseIncasso: boolean;
  isChiuso: boolean;
  dataInsert: string;
  dataUpdate: string;
  dataDelete: string;
  utenteInsertId: number;
  utenteUpdateId: number;
  utenteDeleteId: number;
  tipoDocumentoCodice: string;
  anagCausaleTrasportoDescrizione: string;
  anagTrasportoACuraDelDescrizione: string;
  isSplitPayment: boolean;
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
