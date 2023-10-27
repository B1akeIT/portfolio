import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { ModalChargeWarehouseService } from './modal-charge-warehouse.service';
import { TablesService } from '@app/views/tables/tables.service';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-modal-charge-warehouse',
  templateUrl: './modal-charge-warehouse.component.html',
  styleUrls: ['./modal-charge-warehouse.component.scss']
})
export class ModalChargeWarehouseComponent implements OnInit, AfterViewInit, AfterViewChecked {

  id: number = 0;
  model: string = 'order-supplier';
  orderId: number = 0;
  item: any = null;
  data = {
    documentoTestataId: 0,
    tipoDocumentoId: 0,
    dataCarico: null,
    causaleId: 0,
    magazzinoId: 0,
    contattoId: 0,
    docData: null,
    docRiferimento: '',
    tipoDocumentoFornitore: '',
    isNotificaStatoOrdine: true,
    utenteId: 0,
    isAttivita: true,
    isEMail: true,
    isStampaDettaglio: true,
    isStampaEtichetta: true,
    isStampaEtichettaArticolo: true,
    reportId: 0,
    stampanteId: 0,
    clienteId: 0
  };

  openCreatedDocument = true;

  onClose: Subject<any>;

  elem: ElementRef;
  _H = 0;

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;
  error = false;
  errorMessage = '';

  anagrafiche = [];

  _isOrderSupplier = false;

  _selectedRows = [];

  @HostListener('window:resize', ['$event']) onResize() {
    this._styleBodyDialog();
  }

  constructor(
    protected el: ElementRef,
    public bsModalRef: BsModalRef,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private modalChargeWarehouseService: ModalChargeWarehouseService,
    private tablesService: TablesService
  ) {
    this.elem = el;
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();

    this.modalChargeWarehouseService.reset();
    let _model = '';
    switch (this.model) {
      case 'order-supplier':
        _model = 'OrdineFornitoreDettaglio';
        break;
    }
    this.modalChargeWarehouseService.setModel(_model);
    this.modalChargeWarehouseService.setTenent(tenant);

    this.onClose = new Subject();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);

    const tables = [
      'AnagNazione',
      'AnagCausaleMovimento',
      'AnagMagazzino'
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);
  }

  ngAfterViewInit(): void {
    // this._styleBodyDialog();
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this._styleBodyDialog();
    }, 100);
  }

  _styleBodyDialog() {
    const height = this.elem.nativeElement.clientHeight;
    this._H = height - 56 - 70;
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  onSelectionChanged(selection) {
    console.log('onSelectionChanged modal', selection);
    this._selectedRows = selection;
  }

  applyModal() {
    const result = {
      parametri: this.data,
      righeDettaglio: this._selectedRows
    };
    this.onClose.next(result);
    // this.closeModal();
  }

  isFormReady() {
    let isReady = false;
    if (
      this.data.documentoTestataId > 0 &&
      this.data.tipoDocumentoId > 0 &&
      // this.data.tipoDocumentoFornitore !== '' &&
      this.data.dataCarico !== null &&
      this.data.causaleId > 0 &&
      this.data.magazzinoId > 0 &&
      // this.data.contattoId > 0 &&
      this.data.docData !== null &&
      this.data.docRiferimento !== ''
    ) {
      isReady = true && (this._selectedRows.length > 0);
    }
    return isReady;
  }
}
