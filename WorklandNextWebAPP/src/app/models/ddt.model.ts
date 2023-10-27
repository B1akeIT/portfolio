import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

import * as moment from 'moment';

export class Ddt {
  id: number = 0;
  altreSpese: number;
  anagCausaleTrasportoId: number;
  anagDepartmentDescrizione: string;
  anagDepartmentId: number;
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
  anagPortoId: number;
  anagStatoContoVisioneId: number;
  anagTipoClienteDescrizione: number;
  anagTipoClienteId: number;
  anagTipoPagamentoDescrizione: string;
  anagTipoPagamentoId: number;
  anagTrasportoACuraDelId: number;
  anagUDMPesoId: number;
  anagValutaDescrizione: string;
  anagValutaDescrizioneDiRedazione: number;
  anagValutaId: number;
  anagValutazioneColore: number;
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
  costoTrasportoValoreAzienda: number;
  costoTrasportoPercentualeRicarico: number;
  dataCreazione: string;
  dataInizioTrasporto: string;
  dataScadenza: string;
  dichiarazioneIntento: string;
  doganaCustom: number;
  fatturaTestataId: number;
  ibanAzienda: string;
  imballoTotale: number;
  indirizzoDestinazione: string;
  indirizzoFatturazione: string;
  indirizzoIntestatario: string;
  isChiuso: boolean;
  isEscludiDaFatturare: boolean;
  isEsenteIva: boolean;
  isGeneratoDaOrdiniCliente: boolean;
  isInviatoACLavorazioneDaOrdineCliente: boolean;
  isModSpeseIncasso: boolean;
  isNazioneDestinazioneComunitaria: number;
  isNazioneFatturazioneComunitaria: boolean;
  isNazioneIntestatarioComunitaria: boolean;
  isNoExportAltroSistema: boolean;
  isNotaDiCredito: boolean;
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
  numeroScontrino: number;
  totaleScontrinoInviato: number;
  isAbilitaStampaScontrino: boolean;
  peso: number;
  piva: string;
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
  dataInsert: string;
  dataUpdate: string;
  dataDelete: string;
  utenteInsertId: number;
  utenteUpdateId: number;
  utenteDeleteId: number;
  tipoDocumentoCodice: number;
  anagCausaleTrasportoDescrizione: string;
  anagTrasportoACuraDelDescrizione: string;
  anagPortoDescrizione: string;
  anagUDMPesoDescrizione: string;
  macroCategoriaPerStampa: string;
  documentoCopiatoDa: string;
  DocumentoCopiatoIn: string;
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
