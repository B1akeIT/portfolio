import { Injectable } from '@angular/core';
import { formatCurrency } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { GridFormatters } from '@app/utils/grid-formatters';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GridUtils {

  locale = 'it-IT';
  currency = '€';
  currencyCode = 'EUR';
  digitsInfo = '1.2-2';

  constructor(
    private translate: TranslateService,
    private gridFormatters: GridFormatters
  ) { }


  getColumnDefByField(field) {
    return this._getColumnDef(field, false);
  }

  getColumnDefBySchema(schema) {
    const columnName = schema.ColumnName;

    return this._getColumnDef(columnName, true);
  }

  private _getColumnDef(field, isSchema = false) {
    let colDef = null;
    const fieldNormalized = _.lowerFirst(field);

    switch (fieldNormalized) {

      case 'checkbox':
        colDef = {
          headerName: '',
          field: isSchema ? fieldNormalized : field,
          minWidth: 40, maxWidth: 40,
          headerCheckboxSelection: true,
          // showDisabledCheckboxes: true,
          checkboxSelection: true,
          pinned: 'left'
        };
        break;
      case 'id':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 70, maxWidth: 150,
          headerCheckboxSelection: false,
          // showDisabledCheckboxes: false,
          checkboxSelection: false
        };
        break;
      case 'codiceArticoloPerCliente':
      case 'codiceArticoloPerAzienda':
      case 'fornitoreId':
      case 'codiceFornitore':
      case 'codiceIva':
      case 'originalAnagIvaId':
      case 'anagIvaId':
      case 'uMVisualizzataCodice':
      case 'utenteDeleteId':
      case 'utenteInsertId':
      case 'utenteUpdateId':
      case 'numero':
      case 'numeroRigheDettaglio':
      case 'statoValore':
      case 'statoDescrizione':
      case 'anagTipoClienteId':
      case 'statoDocuemntoId':
      case 'statoDocumentoDescrizione':
      case 'classificazioneArticoloId':
      case 'unitaDiMisuraAcquistoId':
      case 'unitaDiMisuraAcquisto':
      case 'ivaVenditaId':
      case 'categoriaMerceologicaId':
      case 'tipoProdottoId':
      case 'unitaDiMisuraVenditaId':
      case 'unitaDiMisuraVendita':
      case 'anagNazioneId':
      case 'anagIvaAliquota':
      case 'anagIvaCodice':
      case 'contattoId':
      case 'anagTipoPagamentoID':
      case 'anagTipoPagamentoId':
      case 'listinoID':
      case 'anagIVAID':
      case 'anagPortoID':
      case 'bancaAziendaId':
      case 'anagAbiId':
      case 'anagCabId':
      case 'anagLinguaId':
      case 'utenteReferenteId':
      case 'riferimentoCommercialeId':
      case 'anagUnitDiMisuraCodice':
      case 'anagUnitaDIMisuraCodice':
      case 'ordineAFor':
      case 'ordineDaCli':
      case 'magazzinoId':
      case 'clienteProprietarioId':
      case 'unitaId':
      case 'clienteId':
      case 'contattoDestinazioneId':
      case 'nazioneDestinazioneId':
      case 'numeroLetteraDiVettura':
      case 'checkLotti':
      case 'aziendaId':
      case 'anagDescEmailId':
      case 'statoDocumentoCodice':
      case 'anagUdMVisualizzataId':
      case 'riferimentoOrdineCliente':
      case 'numeroPreventivo':
      case 'numeroOrdineCliente':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 70, maxWidth: 70
        };
        break;
      case 'aliquotaIva':
      case 'numColli':
      case 'quantita':
      case 'quantitaEvasa':
      case 'quantitaScaricata':
      case 'quantitaDaAggiornare':
      case 'ricaricoPercentuale':
      case 'numeroRiga':
      case 'anagUDMVisualizzataId':
      case 'anagUnitaDiMisuraCodice':
      case 'anagUnitaDiMisuraId':
      case 'articoloId':
      case 'listinoId':
      case 'preventivoTestataId':
      case 'ricaricoPercentuale':
      case 'riferimentoDocumento':
      case 'sconto1':
      case 'sconto2':
      case 'giacenza':
      case 'disponibilita':
      case 'cap':
      case 'provincia':
      case 'quantitaCaricata':
      case 'quantitaOrdinata':
      case 'quantitaInLavorazione':
      case 'quantitaOrdinataAFornitore':
      case 'preventivoDettaglioId':
      case 'quantitaDisponibilePerMagazziniere':
      case 'quantitaPreparata':
      case 'righeDaEvadere':
      case 'righeProntePerEvasione':
      case 'qtaPreparataAttuale':
      case 'qtaPLAttuale':
      case 'qtaDaConsAttuale':
      case 'quantitaDaEvadere':
      case 'quantitaOrdinabile':
      case 'quantitaMultipla':
      case 'capDestinazione':
      case 'provinciaDestinazione':
      case 'tipoDocumentoId':
      case 'righePronteCompletamente':
      case 'numColli':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 70, maxWidth: 70,
          cellClass: 'text-center'
        };
        break;
      case 'codiceArticolo':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 120, maxWidth: 120
        };
        break;
      case 'codiceArticolo':
      case 'articolo':
      case 'descrizioneEN':
      case 'descrizioneArticoloPerAzienda':
      case 'descrizioneArticoloPerCliente':
      case 'anagraficaProduttore':
      case 'descrizioneIva':
      case 'descrizioneRifiuto':
      case 'categoria':
      case 'tipoProdotto':
      case 'produttore':
      case 'fornitore':
      case 'fornitoreId':
      case 'fornitorePerArticoloId':
      case 'link':
      case 'note':
      case 'notePerFabbisogni':
      case 'statoDocumentazioneDescrizione':
      case 'titolo':
      case 'nominativoIntestatario':
      case 'nominativoFatturazione':
      case 'nominativoDestinazione':
      case 'descrizioneCategoraDocumento':
      case 'referente':
      case 'riferimentoCommerciale':
      case 'riferimentoCliente':
      case 'responsabile':
      case 'orderTerm':
      case 'descrizioneCategoriaDocumento':
      case 'categoriaDocumentoDescrizione':
      case 'ragioneSociale':
      case 'indirizzo':
      case 'comune':
      case 'anagNazioneDescrizione':
      case 'anagIvaDescrizione':
      case 'anagIVADescrizione':
      case 'anagTipoPagamentoDescrizione':
      case 'anagPortoDescrizione':
      case 'banca':
      case 'bancaAbi':
      case 'bancaCab':
      case 'dichiarazioneIntento':
      case 'anagLinguaDescrizione':
      case 'pIva':
      case 'codiceFiscale':
      case 'anagTipoClienteDescrizione':
      case 'anagDepartmentDescrizione':
      case 'nominativoProprietario':
      case 'sezionaleDescrizione':
      case 'barcode':
      case 'listinoDescrizione':
      case 'descrizioneArticoloPerCliene':
      case 'barCode':
      case 'barCodeDocumento':
      case 'note':
      case 'value':
      case 'nominativoDestinzione':
      case 'titoloPreventivo':
      case 'codiceDoganale':
      case 'anagNazioneOrigineDescrizione':
      case 'columnType':
      case 'columnTypeDesc':
      case 'ivaDesc1':
      case 'statoAccettato':
      case 'statoArrivato':
      case 'statoDocumentoId':
      case 'statoEvaso':
      case 'statoFatturato':
      case 'statoInviato':
      case 'bancaAziendaDescrizione':
      case 'iBANAzienda':
      case 'iBAN':
      case 'anagValutazioneDescrizione':
      case 'anagValutazioneColore':
      case 'specializzazioneContattoType':
      case 'esposizione':
      case 'indirizzoDestinazione':
      case 'comuneDestinazione':
      case 'nazioneDestinazione':
      case 'nominativoVettore':
      case 'tipoDocumentoDescrizione':
      case 'email':
      case 'anagDescEmail':
      case 'caricato_da':
      case 'noteInterne':
      case 'anagModalitaPagamentoDescrizione':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 90
        };
        break;
      case 'partNumber':
      case 'classificazione':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 90, maxWidth: 90
        };
        break;
      case 'margine':
      case 'costo':
      case 'prezzoTotale':
      case 'prezzoTotaleScontato':
      case 'prezzoUnitario':
      case 'totaleLordo':
      case 'totaleIva':
      case 'totaleIVA':
      case 'costoTrasporto':
      case 'costoUltimo':
      case 'importoTotaleLordo':
      case 'prezzoEndUserScontato':
      case 'prezzoUnitarioScontato':
      case 'prezzoTotaleLordo':
      case 'prezzoUnitarioLordo':
      case 'speseIncassoPercentuali':
      case 'speseIncasso':
      case 'importoFido':
      case 'totale':
      case 'importo':
      case 'residuo':
      case 'totaleNetto':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 90, maxWidth: 90,
          cellRenderer: this.gridFormatters.currencyFormatter.bind(this)
        };
        break;
      case 'aggregaInStampa':
      case 'isEsclusoInStampa':
      case 'isEsenteIVA':
      case 'isSplitPayment':
      case 'isGestioneLotti':
      case 'isCodArtSelfCreated':
      case 'includi':
      case 'disponibile':
      case 'isEscludiInStampa':
      case 'isNoExportAltroSistema':
      case 'isCliente':
      case 'isConsumabile':
      case 'isPericoloso':
      case 'isLotti':
      case 'isGestioneKit':
      case 'isGenerico':
      case 'isNazioneComunitaria':
      case 'linked':
      case 'anagValutazioneIsEvidenzia':
      case 'isEmailFatturazione':
      case 'isInvioDDT':
      case 'isFuoriPerCL':
      case 'isDefaultValue':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 70, maxWidth: 90,
          cellClass: 'text-center',
          cellRenderer: this.gridFormatters.checkBoxormatter.bind(this)
        };
        break;
      case 'dataDelete':
      case 'dataInsert':
      case 'dataUpdate':
      case 'dataCreazione':
      case 'dataScadenza':
      case 'statoOrdinato':
      case 'statoRifiutato':
      case 'dataPrevistaEvasione':
      case 'dataCostoUltimo':
      case 'dataPagamento':
      case 'dataPreventivo':
      case 'dataOrdineCliente':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 110, maxWidth: 110,
          cellRenderer: this.gridFormatters.dateFormatter.bind(this)
        };
        break;
      case 'statoPercentuale':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 200, maxWidth: 200,
          cellRenderer: this.gridFormatters.multiProgressFormatter.bind(this)
        };
        break;
      case 'completato':
        colDef = {
          headerName: this.translate.instant(`APP.FIELD.${fieldNormalized}`),
          field: isSchema ? fieldNormalized : field,
          minWidth: 110, maxWidth: 110,
          cellRenderer: this.gridFormatters.progressFormatter.bind(this)
        };
        break;
      default:
        colDef = {
          headerName: fieldNormalized,
          field: isSchema ? fieldNormalized : field,
          minWidth: 100, maxWidth: 100
        };
        break;
    }

    return colDef;
  }

  renameJson(json, lower = true) {
    return Object.keys(json).reduce((s, item) => {
      const newkey = lower ? _.lowerFirst(item) : _.upperFirst(item);
      return ({ ...s, [newkey]: json[item] });
    }, {})
  }
}
