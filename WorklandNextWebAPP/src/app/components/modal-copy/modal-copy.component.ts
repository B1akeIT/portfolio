import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { ModalCopyService } from './modal-copy.service';
import { TablesService } from '@app/views/tables/tables.service';
import { CompaniesService } from '@app/views/companies/companies.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ModalContactComponent } from '@app/components/modal-contact/modal-contact.component';
import { ModalLookupComponent } from '@app/components/modal-lookup/modal-lookup.component';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-copy',
  templateUrl: './modal-copy.component.html',
  styleUrls: ['./modal-copy.component.scss']
})
export class ModalCopyComponent implements OnInit, AfterViewInit, AfterViewChecked {

  id: number = 0;
  model: string = ''; // quote  order - order-supplier - ddt - invoice
  item: any = null;
  data: any = {
    item: {},
    sostituisciTestata: false,
    sostituisciPagamento: false,
    copiaAllegati: false,
    numeroDocumento: 0,
    dataCreazione: null,
    selectedAziendaId: 0,
    selectedSezionaleId: 0,
    selectedTipoDocumentoId: 0
  };
  originalData: any = null;
  difference = null;

  openCreatedDocument = true;

  onClose: Subject<any>;

  elem: ElementRef;
  _H = 0;

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  anagrafiche = [];
  anagraficheCombo = [];

  modalContactRef: BsModalRef;
  modalChoiceRef: BsModalRef;

  _isOrderSupplier = false;

  _showIntestatario = true;
  _showSezionale = true;

  companies = [];

  @HostListener('window:resize', ['$event']) onResize() {
    this._styleBodyDialog();
  }

  constructor(
    protected el: ElementRef,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private modalCopyService: ModalCopyService,
    private tablesService: TablesService,
    private companiesService: CompaniesService,
    private gridUtils: GridUtils
  ) {
    this.elem = el;
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();

    const user = this.authenticationService.getUserTenant();
    this.data.selectedAziendaId = user.aziendaId;
    // Default values
    this.data.sostituisciTestata = false;
    this.data.sostituisciPagamento = false;
    this.data.copiaAllegati = false;
    this.data.numeroDocumento = 0;
    this.data.dataCreazione = moment().format('YYYY-MM-DD');
    this.data.selectedTipoDocumentoId = 0;
    this.data.selectedSezionaleId = 0;

    this._isOrderSupplier = (this.model === 'order-supplier');

    this.modalCopyService.reset();
    let _model = '';
    switch (this.model) {
      case 'quote':
        _model = 'PreventivoTestata';
        this._showSezionale = false;
        break;
      case 'order':
        _model = 'OrdineClienteTestata';
        break;
      case 'order-supplier':
        _model = 'OrdineFornitoreTestata';
        break;
      case 'ddt':
        _model = 'DocumentoDiTrasportoTestata';
        break;
      case 'invoice':
        _model = 'FatturaTestata';
        // this._showIntestatario = false;
        break;
    }
    this.modalCopyService.setModel(_model);
    this.modalCopyService.setTenent(tenant);

    this.companiesService.reset();
    this.companiesService.setTenent(tenant);
    this.loadCompanies();

    this.onClose = new Subject();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);

    const tables = [
      'AnagNazione'
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    this._updateTipoDocumento();

    this.loadItem();
  }

  ngAfterViewInit(): void {
    // this._styleBodyDialog();
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this._styleBodyDialog();
    }, 100);
  }

  onChangeAzienda() {
    if (this.model === 'order') {
      this._updateTipoDocumento();
    }
  }

  onChangeDocument() {
    this._updateSezionale();
  }

  _updateTipoDocumento() {
    const combos = [
      {
        name: 'SpComboTipoDocumentoPerCopia', aziendaId: this.item.aziendaId,
        param: `{"TipoDocumentoId":${this.item.tipoDocumentoId},"IsStatoTestata":true}`
      },
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
    setTimeout(() => {
      this.data.selectedTipoDocumentoId = this.item.tipoDocumentoId;
      this.data.selectedSezionaleId = 0;
      this.anagraficheCombo['SpComboSezionale'] = [];
      if (this._showSezionale) { this._updateSezionale(); }
    }, 500);
  }

  _updateSezionale() {
    const combos = [
      {
        name: 'SpComboSezionale', aziendaId: this.item.aziendaId,
        param: `{"TipoDocumentoId":${this.data.selectedTipoDocumentoId}}`
      },
    ];
    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
  }

  _styleBodyDialog() {
    const height = this.elem.nativeElement.clientHeight;
    this._H = height - 56 - 70;
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  loadCompanies() {
    this.loading = true;
    this.companiesService.getListModel().subscribe(
      (response: any) => {
        this.companies = (response.items || []).map(item => this.gridUtils.renameJson(item));
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  loadItem() {
    if (this.id) {
      this.loading = false;
      this.modalCopyService.getModel(this.id).subscribe(
        (response: any) => {
          this.item = this.gridUtils.renameJson(response);
          this.data.item = { ...this.item };

          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    }
  }

  modifiedModel(obj1, obj2) {
    this.difference = this.utilsService.objectsDiff(obj1, obj2);
    return !_.isEmpty(this.difference);
  }

  isModifiedProperty(property) {
    return (this.difference && this.difference.hasOwnProperty(property));
  }

  openChoiceModal(type) {
    let initialState = {};

    switch (type) {
      case 'intestatario':
        if (this.model === 'order-supplier') {
          initialState = {
            model: type,
            nomeSp: 'SpComboFornitoreLookUp',
            item: {}
          };
        } else {
          initialState = {
            model: type,
            nomeSp: 'SpComboContattoLookUp',
            item: {}
          };
        }
        break;
      case 'fatturazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboClienteLookUp',
          item: {}
        };
        break;
      case 'destinazione':
        initialState = {
          model: type,
          nomeSp: 'SpComboDestinazioneLookUp',
          item: {}
        };
        break;
    }

    this.modalChoiceRef = this.modalService.show(ModalLookupComponent, {
      id: 'modalChoice',
      backdrop: 'static',
      ignoreBackdropClick: true,
      class: 'modal-lg-full',
      initialState: initialState
    });
    this.modalChoiceRef.content.onClose.subscribe(
      (result: any) => {
        if (result) {
          const _result = this._fixKeys(result);
          this.onChangeContact(type, _result);
        }
        // this.modalService.hide('modalChoice');
      }
    );
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

  onFormChanges($event) {
    this.modifiedModel(this.data, this.originalData);
  }

  onChangeContact(type, event) {
    switch (type) {
      case 'intestatario':
        this.data.item.contattoIntestatarioId = event?.contattoId;
        this.data.item.nominativoIntestatario = event?.ragioneSociale;
        this.data.item.indirizzoIntestatario = event?.indirizzo;
        this.data.item.comuneIntestatario = event?.comune;
        this.data.item.provinciaIntestatario = event?.provincia;
        this.data.item.capIntestatario = event?.cap;
        this.data.item.nazioneIntestatario = event?.nazione;
        this.data.item.nazioneIntestatarioId = event?.anagNazione;
        this.data.item.codiceFiscale = event?.codiceFiscale;
        this.data.item.piva = event?.pIva;
        break;
      case 'fatturazione':
        this.data.item.contattoFatturazioneId = event?.contattoId;
        this.data.item.nominativoFatturazione = event?.ragioneSociale;
        this.data.item.indirizzoFatturazione = event?.indirizzo;
        this.data.item.comuneFatturazione = event?.comune;
        this.data.item.provinciaFatturazione = event?.provincia;
        this.data.item.capFatturazione = event?.cap;
        this.data.item.nazioneFatturazione = event?.nazione;
        this.data.item.nazioneFatturazioneId = event?.anagNazione;
        break;
      case 'destinazione':
        this.data.item.contattoDestinazioneId = event?.contattoId;
        this.data.item.nominativoDestinazione = event?.ragioneSociale;
        this.data.item.indirizzoDestinazione = event?.indirizzo;
        this.data.item.comuneDestinazione = event?.comune;
        this.data.item.provinciaDestinazione = event?.provincia;
        this.data.item.capDestinazione = event?.cap;
        this.data.item.nazioneDestinazione = event?.nazione;
        this.data.item.nazioneDestinazioneId = event?.anagNazione;
        break;
      default:
        break;
    }
    this.onFormChanges(event);
  }

  showContact(id, title) {
    const initialState = {
      contactId: id,
      contactTitle: title,
      showHeader: false,
      showFooter: false
    };
    this.modalContactRef = this.modalService.show(ModalContactComponent, {
      id: 'modalContact',
      ignoreBackdropClick: true,
      class: 'modal-lg-full',
      initialState: initialState
    });
    this.modalContactRef.content.onClose.subscribe(
      (result: any) => {
        // console.log('showContact close', result);
        // this.modalService.hide('modalContact');
      }
    );
  }

  applyModal() {
    this.modalCopyService.copy(this.data).subscribe(
      (response) => {
        const result = { openCreatedDocument: this.openCreatedDocument, response: response };
        this.onClose.next(result);
        this.closeModal();
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }
}
