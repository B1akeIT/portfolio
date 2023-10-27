import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { UtilsService } from '@app/services/utils.service';
import { GridUtils } from '@app/utils/grid-utils';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { TableModalService } from '@app/services/tables-modal.service';
import { ContactsService } from '@app/views/contacts/contacts.service';
import { TablesService } from '@app/views/tables/tables.service';
import { NotificationService } from '@app/core/notifications/notification.service';

import { ClientAccounting } from '@app/models/client-accounting.model';
import { SupplierAccounting } from '@app/models/supplier-accounting.model';

import { APP_CONST } from '@app/shared/const';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-accounting-edit',
  templateUrl: './accounting-edit.component.html',
  styleUrls: ['./accounting-edit.component.scss']
})
export class AccountingEditComponent implements OnInit, OnChanges, OnDestroy {

  @Input() clientId = null;
  @Input() aziendaId = null;
  @Input() aziendaData = null;
  @Input() type = null;
  @Input() edit = false;
  @Input() readOnly = false;

  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeEdit: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;

  accountingData = null;
  wAccountingData = null;
  // dataForm: FormGroup;

  objectKey = Object.keys;

  excluded = APP_CONST.fieldExcluded;

  user = null;

  anagrafiche = [];
  anagraficheCombo = [];

  modalTableRef: BsModalRef;
  currentTable = null;
  tables = null;
  tableSaveSubscription: Subscription;

  constructor(
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
    private utilsService: UtilsService,
    private gridUtils: GridUtils,
    private eventsManagerService: EventsManagerService,
    private tableMS: TableModalService,
    private contactsService: ContactsService,
    private tablesService: TablesService,
    private notificationService: NotificationService
  ) { }

  ngOnChanges(changes: any) {
    if (this.clientId && this.aziendaId && this.type) {
      this.initData();
      this.loadData();
    }
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserTenant();
    this.initData();
  }

  ngOnDestroy() {
    this.tableSaveSubscription.unsubscribe();
  }

  initData() {
    const tenant = this.authenticationService.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);

    let tables = [];
    let combos = [];

    if (this.isClient()) {
      tables = [
        // 'AnagIVA',
        // 'AnagAbi',
        // 'AnagCab',
        // 'AnagPorto',
        // 'AnagModalitaPagamento',
        // 'AnagTipoPagamento',
        // 'AnagListino',
      ];

      combos = [
        {
          name: 'SpComboIva',
          param: `{"AziendaId":${this.aziendaId}}`
        },
        'SpComboPorto',
        'SpComboAbi',
        // 'SpComboAnagCAB',
        'SpComboModalitaPagamento',
        // 'SpComboTipoPagamento',
        {
          name: 'SpComboListino',
          param: `{"AziendaId":${this.aziendaId}}`
        }
      ];
    } else {
      tables = [
        'AnagIVA',
      ];

      combos = [
        'SpComboIva'
      ];
    }
    // this.anagrafiche = [];
    // this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);

    this.tableSaveSubscription = this.tableMS.onSave.subscribe(
      (result: any) => {
        const updateTables = [result.table.api];
        this.utilsService.getAnagrafiche(updateTables, this.anagrafiche);
      }
    );

    // this.initForm();
  }

  loadCabByAbi(id) {
    if (id) {
      const combos = [
        { name: 'SpComboAnagCAB', param: `{"Id":${id}}` },
      ];
      this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
      this.wAccountingData.anagCabId = null;
    }
  }

  loadTipoByModalita(id) {
    if (id) {
      const combos = [
        { name: 'SpComboTipoPagamentoPerModalita', param: `{"AnagModalitaPagamentoId":${id}}` },
      ];
      this.utilsService.getAnagraficheCombo(combos, this.anagraficheCombo);
      this.wAccountingData.anagTipoPagamentoId = null;
    }
  }

  initForm() {
    // this.dataForm = new FormGroup({
    //   listinoId: new FormControl(''),
    //   referente: new FormControl(''),
    //   importoFido: new FormControl(''),
    //   esposizione: new FormControl(''),
    //   iban: new FormControl(''),
    //   abiDto: new FormControl(''),
    //   cabDto: new FormControl(''),
    //   bancaCIN: new FormControl(''),
    //   bancaCC: new FormControl(''),
    //   nCell: new FormControl(''),
    //   nFax: new FormControl(''),
    //   nTel: new FormControl(''),
    //   dichIntImporto: new FormControl(''),
    // });
  }

  loadData() {
    // this.edit = false;
    this.loading = true;
    this.contactsService.getContactTypeAzienda(this.clientId, this.type, this.aziendaId).subscribe(
      (response: any) => {
        if (response) {
          this.accountingData = this.gridUtils.renameJson(JSON.parse(JSON.stringify(response)));
          this.wAccountingData = this.gridUtils.renameJson(JSON.parse(JSON.stringify(response)));
        } else {
          if (this.isClient()) {
            this.accountingData = new ClientAccounting({
              clienteId: this.clientId,
              aziendaId: this.aziendaId
            });
          } else {
            this.accountingData = new SupplierAccounting({
              fornitoreId: this.clientId,
              aziendaId: this.aziendaId
            });
          }
          this.wAccountingData = this.accountingData;
        }
        this.loadTipoByModalita(this.wAccountingData.anagModalitaPagamentoId);
        this.loadCabByAbi(this.wAccountingData.anagAbiId);
        this.setFormatData();
        this.loading = false;
      }
    );
  }

  setFormatData() {
    Object.keys(this.accountingData).forEach((key) => {
      switch (key) {
        case 'dataInizioInt':
        case 'dataUltimoAggiornamentoFido':
          this.accountingData[key] = (this.accountingData[key] && this.accountingData[key] !== '') ? moment(this.accountingData[key], 'YYYY-MM-DD').format('YYYY-MM-DD') : '';
          // tslint:disable-next-line: max-line-length
          this.wAccountingData[key] = (this.wAccountingData[key] && this.wAccountingData[key] !== '') ? moment(this.wAccountingData[key], 'YYYY-MM-DD').format('YYYY-MM-DD') : '';
          break;
        default:
          break;
      }
    });
  }

  onDelete(event) {
    // this.delete.emit(event);
    if (this.isClient()) {
      this.contactsService.deleteClientContabilita(event.id).subscribe(
        (resp: any) => {
          this.accountingData = null;
          this.wAccountingData = null;
          this.notificationService.deleted();
        },
        (error: any) => {
          const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
          const message = error.message;
          this.notificationService.error(message, title);
        }
      );
    } else {
      this.contactsService.deleteFornitoreContabilita(event.id).subscribe(
        (resp: any) => {
          this.accountingData = null;
          this.wAccountingData = null;
          this.notificationService.deleted();
        },
        (error: any) => {
          const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
          const message = error.message;
          this.notificationService.error(message, title);
        }
      );
    }
  }

  cancelEdit(event) {
    this.edit = false;
    this.wAccountingData = JSON.parse(JSON.stringify(this.accountingData));
    this.loadTipoByModalita(this.wAccountingData.anagModalitaPagamentoId);
    this.loadCabByAbi(this.wAccountingData.anagAbiId);
    this.closeEdit.emit(this.wAccountingData);
  }

  onEdit(event) {
    this.wAccountingData = JSON.parse(JSON.stringify(this.accountingData));
    this.edit = true;
  }

  onSave(event) {
    const body = this.wAccountingData;

    let obs$ = null;

    if (this.isClient()) {
      obs$ = this.contactsService.saveClientContabilita(body);
    } else {
      obs$ = this.contactsService.saveSupplierContabilita(body);
    }

    obs$.subscribe(
      (response: any) => {
        this.accountingData = this.gridUtils.renameJson(response);
        this.wAccountingData = this.gridUtils.renameJson(response);
        this.setFormatData();

        this.notificationService.saved();

        this.edit = !this.edit;
        this.closeEdit.emit(this.wAccountingData);
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      }
    );
  }

  // Utilities

  isClient() {
    return ((this.type === 'Cliente') || (this.type === 'client'));
  }

  isSupplier() {
    return ((this.type === 'Fornitore') || (this.type === 'supplier'));
  }

  customSearchFn(term, item) {
    term = term.toLowerCase();
    return item.descrizione.toLowerCase().indexOf(term) > -1;
  }

  onChangeSelect(event) {
    // this.onFormChanges(event);
  }

  clearField(field, anag) {
    if (this.wAccountingData[field]) {
      this.wAccountingData[field] = null;
      this.anagraficheCombo[anag] = [];
    }
  }
}
