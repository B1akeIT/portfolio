import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { forkJoin, Observable, of, Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { EventsManagerService } from '@app/services';
import { ModalGeneraNcService } from './modal-genera-nc.service';
import { TablesService } from '@app/views/tables/tables.service';
import { GridUtils } from '@app/utils/grid-utils';
import { InvoicesService } from '../invoices.service';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-modal-genera-nc',
  templateUrl: './modal-genera-nc.component.html',
  styleUrls: ['./modal-genera-nc.component.scss']
})
export class ModalGeneraNcComponent implements OnInit, AfterViewInit, AfterViewChecked {

  id: number = 0;
  model: string = 'quote';
  item: any = null;
  data: any = {
    parametri: {
      dataDocumento: null,
      numDocumento: 0,
      sezionaleId: 0,
      magazzinoId: 0,
      valutaId: 0,
      cambio: 0,
      aziendaId: 0
    },
    testata: null,
    dettagliToAdd: []
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

  modalContactRef: BsModalRef;
  modalChoiceRef: BsModalRef;

  anagraficheCombo = [];

  @HostListener('window:resize', ['$event']) onResize() {
    this._styleBodyDialog();
  }

  _gridApi;
  gridInitialized = false;
  _gridColumnApi;

  _agDefaultColumnDefs = null;
  _agColumnDefs = [];
  _agGridOptions = {};

  _schema = [];
  selectedQuotes = [];

  step = 1;

  itemList = [];

  constructor(
    protected el: ElementRef,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private utilsService: UtilsService,
    private eventsManagerService: EventsManagerService,
    private modalGeneraNcService: ModalGeneraNcService,
    private tablesService: TablesService,
    private gridUtils: GridUtils,
    private invoicesService: InvoicesService
  ) {
    this.elem = el;

    const tenant = this.authenticationService.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);

    this.invoicesService.setTenent(tenant);
  }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();

    this.modalGeneraNcService.reset();
    let _model = 'FatturaTestata';
    this.modalGeneraNcService.setModel(_model);
    this.modalGeneraNcService.setTenent(tenant);

    this.onClose = new Subject();

    this._initCombo();

    this.loading = false;
    this.modalGeneraNcService.getDefaultValues().subscribe(
      (response: any) => {
        this.data.parametri.sezionaleId = response.sezionaleId;
        this.data.parametri.dataDocumento = response.DataCreazione ? moment(response.DataCreazione, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;
        // this.data.parametri.numDocumento = response.NumDocumento;
        // this.data.parametri.aziendaId = response.AziendaId;

        this.openCreatedDocument = response.ApriDocumentoCreato;

        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this._styleBodyDialog();
    }, 100);
  }

  _initCombo() {
    const combos = [
      // 'SpComboNazione',
      {
        name: 'SpComboSezionale', aziendaId: this.item.aziendaId,
        param: `{"TipoDocumentoId":${this.item.tipoDocumentoId}}`
      },
      'SpComboValuta',
      { name: 'SpComboMagazzino', aziendaId: this.item.aziendaId },
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

  onFormChanges($event) {
    this.modifiedModel(this.data, this.originalData);
  }

  applyModal() {
    this.data.testata = this.item;
    this.data.dettagliToAdd = this.data.dettagliToAdd.map(item => this.gridUtils.renameJson(item, false));

    this.modalGeneraNcService.create(this.data).subscribe(
      (response) => {
        const result = { openCreatedDocument: this.openCreatedDocument, response: response };
        this.onClose.next(result);
        this.closeModal();

        this.notificationService.success('APP.MESSAGE.generation_nota_credito_successful', 'APP.TITLE.invoice');
      },
      (error) => {
        console.log('Error', error);
        this.error = true;
        this.errorMessage = error.message;
        this.notificationService.error('APP.MESSAGE.generation_nota_credito_unsuccessful', 'APP.MESSAGE.error');
      }
    );
  }

  onSelectedRows(event: any) {
    this.data.dettagliToAdd = event;
  }

  loadInvoiceItems(ids) {
    const reqs: Observable<any>[] = [];

    this.loading = true;
    ids.forEach(id => {
      this.itemList = [];
      reqs.push(
        this.invoicesService.getInvoiceDetailsNC(id, this.item)
          .pipe(
            catchError((err) => {
              console.log('loadInvoiceItems error', id, err);
              return of({ items: [] });
            })
          )
      );
    });

    forkJoin(reqs).subscribe(
      (results: Array<any>) => {
        results.forEach((result, index) => {
          if (results[index] && results[index].items) {
            this.itemList = [ ...this.itemList, ...results[index].items ];
          }
        });
        this.loading = false;
      },
      (error: any) => {
        console.log('loadInvoiceItems forkJoin error', error);
        this.loading = false;
      }
    );
  }
}
