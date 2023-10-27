import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class Order {
  id: number = 0;
  altreSpese: number;
  anagIVACodice: string;
  anagIVACodiceAltreSpese: string;
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
  bancaAziendaDescrizione: string;
  bancaAziendaId: number;
  bolliSuEffetti: number;
  bolliSuEsenti: number;
  cambio: number;
  capDestinazione: string;
  capFatturazione: string;
  capIntestatario: string;
  capVettore: string;
  categoriaDocumentoDescrizione: string;
  categoriaDocumentoId: number;
  clienteFatturazioneId: number;
  clienteIntestatarioId: number;
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
  costoTrasportoValoreAzienda: number;
  costoTrasportoPercentualeRicarico: number;
  costoTrasportoValore: number;
  dataCreazione: string;
  dataInsert: string;
  dataUpdate: string;
  dataDelete: string;
  dataPrevistaEvasione: string;
  dichiarazioneIntento: string;
  doganaCustom: string;
  extraFido: boolean;
  iBANAzienda: string;
  idMyVss: number;
  imballoTotale: number;
  importoExtra: number;
  indirizzoDestinazione: string;
  indirizzoFatturazione: string;
  indirizzoIntestatario: string;
  indirizzoVettore: string;
  isEsenteIva: boolean;
  isNoExportAltroSistema: boolean;
  isRinnovoAutomatico: boolean;
  isStessoFatturazione: number;
  iva: any;
  ivaAltreSpeseId: number;
  ivaBolliSuEffettiId: number;
  ivaBolliSuEsentiId: number;
  ivaDoganaCustom: any;
  ivaDoganaCustomId: number;
  ivaImballoId: number;
  ivaSpeseDiIncassoId: number;
  ivaTrasportoId: number;
  listinoDescrizione: string;
  listinoId: number;
  magazzinoId: number;
  nazioneDestinazione: string;
  nazioneDestinazioneId: number;
  nazioneFatturazione: string;
  nazioneFatturazioneId: number;
  nazioneIntestatario: string;
  nazioneIntestatarioId: number;
  nazioneVettore: string;
  nazioneVettoreId: number;
  nominativoDestinazione: string;
  nominativoFatturazione: string;
  nominativoIntestatario: string;
  nominativoVettore: string;
  noteInterne: string;
  numero: number;
  ordineClienteProvenienzaId: number;
  pIVA: string;
  provinciaDestinazione: string;
  provinciaFatturazione: string;
  provinciaIntestatario: string;
  provinciaVettore: string;
  responsabile: string;
  riferimentoCliente: string;
  riferimentoCommerciale: string;
  riferimentoCommercialeId: number;
  scontoPercentuale: number;
  scontoValore: number;
  sezionaleId: number;
  sezionaleDescrizione: string;
  sospeso: boolean;
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
  utenteCarrello: string;
  valutaDiRedazioneId: number;
  vettoreId: number;
  isNazioneIntestatarioComunitaria: boolean;
  isNazioneFatturazioneComunitaria: boolean;
  isNazioneDestinazioneComunitaria: boolean;
  utenteInsertId: number;
  utenteUpdateId: number;
  utenteDeleteId: number;
  tipoDocumentoCodice: number;
  anagDepartmentId: number;
  anagDepartmentDescrizione: string;
  unitaId: number;
  clienteProprietarioId: number;
  nominativoProprietario: string;
  anagValutazioneColore: number;
  anagValutazioneDescrizione: string;
  anagValutazioneIsEvidenzia: number;
  isReadOnly: boolean;
  costoTrasportoValore_Evaso: number;
  scontoValore_Evaso: number;
  costoImballoValore_Evaso: number;
  altreSpese_Evaso: number;
  doganaCustom_Evaso: number;
  documentoCopiatoDa: string;
  documentoCopiatoIn: string;
  abbonamentoVettore: string;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'dataCreazione':
        case 'dataInsert':
        case 'dataUpdate':
        case 'dataDelete':
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
