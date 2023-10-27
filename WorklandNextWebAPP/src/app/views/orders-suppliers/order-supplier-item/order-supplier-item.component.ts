import { Component, OnInit, Input, OnChanges, EventEmitter, Output, ViewChild, TemplateRef, OnDestroy, SimpleChanges } from '@angular/core';
import { formatNumber, formatCurrency } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { NotificationService } from '@app/core/notifications/notification.service';
import { TablesService } from '@app/views/tables/tables.service';
import { GridUtils } from '@app/utils/grid-utils';
import { OrdersSuppliersService } from '../orders-suppliers.service';

import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';

import { OrderItem } from '@app/models/order-item.model';

import { APP_CONST } from '@app/shared/const';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-order-supplier-item',
  templateUrl: './order-supplier-item.component.html',
  styleUrls: ['./order-supplier-item.component.scss']
})
export class OrderSupplierItemComponent implements OnInit, OnChanges {

  @Input() itemId = null;
  @Input() orderId = null;
  @Input() numeroRiga = null;
  @Input() fGroup: FormGroup;

  @Output() modified: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  user = null;

  item = null;

  originalItem = null;
  difference = null;

  articoli$: Observable<any>;
  articoliLoading = false;
  articoliInput$ = new Subject<string>();
  selectedArticoli: any;
  minLengthTerm = 3;
  minTranslateParams = { min: this.minLengthTerm };

  _modCodiceCombo = false;

  modalChoiceRef: BsModalRef;

  anagrafiche = [];

  locale = 'it-IT';
  currency = '';
  currencyCode = 'EUR';
  digitsInfo = '1.2-2';

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService,
    private tablesService: TablesService,
    private gridUtils: GridUtils,
    private ordersService: OrdersSuppliersService
  ) {
    this.user = this.authenticationService.getUserTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.authenticationService.getCurrentTenant());

    // anagIvaId: 6
    // anagUDMVisualizzataId: null
    // anagUnitaDiMisuraId: null
    // anagraficaProduttore: ""
    // codiceIva: null
    // listinoId: null
    // statoDocumentoId: null
    // unitaDiMisura: null

    const tables = [
      'AnagIVA',
      'AnagUnitaDiMisura',
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.itemId) {
      this.itemId = changes.itemId.currentValue;
      this.loadOrderItem();
    }
  }

  ngOnInit() {
  }

  initForm(data) {
    Object.keys(data).forEach((key) => {
      let value = '';
      switch (key) {
        case 'ordineClienteTestataId':
          value = data[key] ? data[key] : this.orderId;
          break;
        default:
          value = data[key] ? data[key] : null;
          break;
      }
      this.fGroup.addControl(key, new FormControl(value));
    });
    this.fGroup.addControl('totaleLordo', new FormControl());
    this.fGroup.addControl('totaleIva', new FormControl());
    this.ricalcolaValori('all');

    this.fGroup.valueChanges.subscribe(val => {
      this.onFormChanges(val);
    });
  }

  loadOrderItem() {
    this.loading = true;
    if (this.itemId) {
      this.ordersService.getOrderItem(this.itemId).subscribe(
        (response: any) => {
          const _item = this.gridUtils.renameJson(response);
          this.item = new OrderItem(_item);
          this.initForm(this.item);

          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    } else {
      this.item = new OrderItem({
        preventivoTestataId: this.orderId,
        numeroRiga: this.numeroRiga
      });
      this.initForm(this.item);
      this.loading = false;
    }
  }

  trackByArticoli(item: any) {
    return item.id;
  }

  onChangeArticolo(data) {
    if (data) {
      this.fGroup.patchValue({
        codiceArticolo: data.codiceArticolo,
        descrizione: data.descrizione,
        descrizioneArticoloPerAzienda: data.descrizioneArticoloPerAzienda || data.descrizione,
        descrizioneEN: data.descrizioneEN,
        partNumber: data.partNumber,
        anagraficaProduttore: data.produttore,
        numColli: data.numColli,
        anagIvaId: data.ivaVenditaId,
        fornitore: data.fornitore,
        fornitoreId: data.fornitoreId,
        codiceFornitore: data.codiceFornitore,
        costo: data.costoUltimo,
        prezzoUnitario: data.prezzoUnitario,
        categoria: data.categoria,
        prezzoTotaleScontato: data.prezzoTotaleScontato,
        quantita: data.quantita,
        note: data.note,
        link: data.link,
        descrizioneArticoloPerCliente: data.descrizioneArticoloPerCliente,
        anagUnitaDiMisuraId: data.unitaDiMisuraVenditaId,
        ricaricoPercentuale: data.ricaricoPercentuale,
      });
    }
    this._modCodiceCombo = false;
    this.ricalcolaValori('all');
  }

  onChangeFornitore(data) {
    console.log('result', data);
    if (data) {
      this.fGroup.patchValue({
        fornitoreId: data.fornitoreId,
        fornitore: data.ragioneSociale,
      });
    }
  }

  onChangeContatto(type, data) {
    console.log('result', type, data);
  }

  onFormChanges(event) {
    if (this.modifiedModel(event, this.item)) {
      this.modified.emit(this.difference);
    }
  }

  onChangeIvaId(event) {
    this.fGroup.patchValue({
      aliquotaIva: event.aliquota,
      codiceIva: event.codice,
      descrizioneIva: event.descrizione,
    });

    this.ricalcolaValori('aliquotaIva');
  }

  onChangeUDMId(event) {
    // console.log('onChangeUDMId', event);
  }

  modifiedModel(obj1, obj2) {
    this.difference = this.utilsService.objectsDiff(obj1, obj2);
    return !_.isEmpty(this.difference);
  }

  isModifiedProperty(property) {
    return (this.difference && this.difference.hasOwnProperty(property));
  }

  _fixKeys(data) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      const newKey = _.lowerFirst(key);
      data[newKey] = data[key];
      delete data[key];
    });

    return data;
  }

  openChoiceModal(type) {
    let initialState = {};

    switch (type) {
      case 'articolo':
        initialState = {
          model: 'articolo',
          nomeSp: 'SpComboArticoloLookUp',
          item: this.item
        };
        this.modalChoiceRef = this.modalService.show(ModalLookupComponent, {
          ignoreBackdropClick: true,
          class: 'modal-lg-full',
          initialState: initialState
        });
        this.modalChoiceRef.content.onClose.subscribe(
          (result: any) => {
            const _result = this._fixKeys(result);

            this.onChangeArticolo(_result);
          }
        );
      break;

      case 'fornitore':
        initialState = {
          model: 'fornitore',
          nomeSp: 'SpComboFornitoreLookUp',
          item: this.item
        };
        this.modalChoiceRef = this.modalService.show(ModalLookupComponent, {
          ignoreBackdropClick: true,
          class: 'modal-lg-full',
          initialState: initialState
        });
        this.modalChoiceRef.content.onClose.subscribe(
          (result: any) => {
            const _result = this._fixKeys(result);

            this.onChangeFornitore(_result);
          }
        );
      break;
    }
  }

  customSearchFn(term, item) {
    term = term.toLowerCase();
    return item.descrizione.toLowerCase().indexOf(term) > -1;
  }

  localformatCurrency(value: number): string {
    // return formatCurrency(value, this.locale, this.currency, this.currencyCode, this.digitsInfo);
    // return String(parseFloat(String(value)).toFixed(2));
    return formatNumber(value, 'EN', this.digitsInfo);
  }

  ricalcolaValori(field) {
    // console.log('ricalcolaValori', field);
    const aliquotaIva = Number(this.fGroup.controls['aliquotaIva'].value) || 0;
    const quantita = Number(this.fGroup.controls['quantita'].value) || 0;
    let prezzoUnitario = Number(this.fGroup.controls['prezzoUnitario'].value) || 0;
    const costo = Number(this.fGroup.controls['costo'].value) || 0;
    const sconto1Perc = Number(this.fGroup.controls['sconto1'].value) || 0;
    const sconto2Perc = Number(this.fGroup.controls['sconto2'].value) || 0;
    let prezzoTotale = Number(this.fGroup.controls['prezzoTotale'].value) || 0;
    let margine = Number(this.fGroup.controls['margine'].value) || 0;
    let totaleLordo = Number(this.fGroup.controls['totaleLordo'].value) || 0;

    const sconto1 = Math.round((prezzoUnitario * sconto1Perc) / 100);
    const prezzoScontatoTemp = prezzoUnitario - sconto1;
    const sconto2 = Math.round((prezzoScontatoTemp * sconto2Perc) / 100);
    const scontoTotale = sconto1 + sconto2;
    const prezzoUnitarioScontato = prezzoUnitario - scontoTotale;
    const totaleNetto = prezzoUnitarioScontato * quantita;
    const totaleIva = Math.round((totaleNetto * aliquotaIva) / 100);

    prezzoTotale = totaleNetto;
    totaleLordo = totaleNetto + totaleIva;
    margine = (prezzoUnitarioScontato - costo) * quantita;

    switch (field) {
      case 'quantita':
        this.fGroup.patchValue({
          prezzoUnitarioScontato: this.localformatCurrency(prezzoUnitarioScontato),
          prezzoTotale: this.localformatCurrency(prezzoTotale),
          totaleIva: this.localformatCurrency(totaleIva),
          totaleLordo: this.localformatCurrency(totaleLordo),
          margine: this.localformatCurrency(margine)
        });
        break;
      case 'prezzoUnitario':
        this.fGroup.patchValue({
          prezzoUnitarioScontato: this.localformatCurrency(prezzoUnitarioScontato),
          prezzoTotale: this.localformatCurrency(prezzoTotale),
          totaleIva: this.localformatCurrency(totaleIva),
          totaleLordo: this.localformatCurrency(totaleLordo),
          margine: this.localformatCurrency(margine)
        });
        break;
      case 'ricaricoPercentuale':
      case 'costo':
        const ricaricoPercentuale = Number(this.fGroup.controls['ricaricoPercentuale'].value) || 0;
        const ricaricoPercentualeTemp = Math.round((costo * ricaricoPercentuale) / 100);
        prezzoUnitario = costo + ricaricoPercentualeTemp;
        this.fGroup.patchValue({
          prezzoUnitario: prezzoUnitario
        });
        this.ricalcolaValori('prezzoUnitario');
        break;
      case 'sconto1':
      case 'sconto2':
        this.fGroup.patchValue({
          prezzoUnitarioScontato: this.localformatCurrency(prezzoUnitarioScontato),
          prezzoTotale: this.localformatCurrency(prezzoTotale),
          totaleIva: this.localformatCurrency(totaleIva),
          totaleLordo: this.localformatCurrency(totaleLordo),
          margine: this.localformatCurrency(margine)
        });
        break;
      case 'aliquotaIva':
        this.fGroup.patchValue({
          totaleIva: this.localformatCurrency(totaleIva),
          totaleLordo: this.localformatCurrency(totaleLordo)
        });
        break;
      case 'all':
        this.fGroup.patchValue({
          prezzoUnitario: prezzoUnitario,
          prezzoUnitarioScontato: this.localformatCurrency(prezzoUnitarioScontato),
          prezzoTotale: this.localformatCurrency(prezzoTotale),
          totaleIva: this.localformatCurrency(totaleIva),
          totaleLordo: this.localformatCurrency(totaleLordo),
          margine: this.localformatCurrency(margine)
        });
        break;
      default:
        break;
    }

    // console.group('ricalcolaValori');
    // console.log('aliquotaIva', aliquotaIva);
    // console.log('quantita', quantita);
    // console.log('prezzoUnitario', prezzoUnitario);
    // console.log('costo', costo);
    // console.log('sconto1Perc', sconto1Perc);
    // console.log('sconto2Perc', sconto2Perc);
    // console.log('sconto1', sconto1);
    // console.log('sconto2', sconto2);
    // console.log('scontoTotale', scontoTotale);
    // console.log('prezzoUnitarioScontato', prezzoUnitarioScontato);
    // console.log('totaleNetto', totaleNetto);
    // console.log('prezzoTotale', prezzoTotale);
    // console.log('totaleIva', totaleIva);
    // console.log('totaleLordo', totaleLordo);
    // console.log('margine', margine);
    // console.groupEnd();
  }
}
