import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '@app/services/authentication.service';
import { EventsManagerService } from '@app/services';
import { UtilsService } from '@app/services/utils.service';
import { ContactsService } from '@app/views/contacts/contacts.service';
import { TableModalService } from '@app/services/tables-modal.service';
import { TablesService } from '@app/views/tables/tables.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { GridUtils } from '@app/utils/grid-utils';
import { UnitaService } from '../unita-list/unita.service';

import { APP_CONST } from '@app/shared/const';

import { noop, Observable, Observer, of, Subscriber, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Unita } from '@app/models/unita.model';

import * as _ from 'lodash';

@Component({
  selector: 'app-unita-edit',
  templateUrl: './unita-edit.component.html',
  styleUrls: ['./unita-edit.component.scss']
})
export class UnitaEditComponent implements OnInit, OnChanges, OnDestroy {

  @Input() clientId: string | null = null;
  @Input() contact: any = null;
  @Input() trasform: boolean = false;
  @Input() unitaId: string | null = null;
  @Input() name: string | null = null;
  @Input() edit: boolean = false;
  @Input() showDelete: boolean = true;
  @Input() readOnly: boolean = false;
  @Input() titleDelete: string = 'APP.TITLE.disconnect';
  @Input() messageDelete: string = 'APP.MESSAGE.are_you_sure_unit';
  @Input() confirmText: string = 'APP.BUTTON.confirm';
  @Input() cancelText: string = 'APP.BUTTON.cancel';
  @Input() iconDelete: string = 'icon-link';

  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeEdit: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  loadingOptions = APP_CONST.loadingOptions;

  unitaData = null;
  wUnitaData = null;
  dataForm: FormGroup;

  objectKey = Object.keys;

  excluded = APP_CONST.fieldExcluded;

  user = null;

  anagrafiche = [];

  search: string;
  shipyardSuggestions$: Observable<any[]>;
  errorMessage: string;

  newUnitName = '';

  modalTableRef: BsModalRef;
  currentTable = null;
  tables = null;
  tableSaveSubscription: Subscription;

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private eventsManagerService: EventsManagerService,
    private utilsService: UtilsService,
    private contactsService: ContactsService,
    private unitaService: UnitaService,
    public tableMS: TableModalService,
    private tablesService: TablesService,
    private notificationService: NotificationService,
    private gridUtils: GridUtils,
  ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserTenant();

    const tenant = this.authenticationService.getCurrentTenant();
    this.unitaService.reset();
    this.unitaService.setTenent(tenant);

    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.unitaId) {
      // this.unitaId = changes.unitaId.currentValue;
      this.loadData();
    }
  }

  ngOnDestroy() {
    this.tableSaveSubscription.unsubscribe();
  }

  initData() {
    const tenant = this.authenticationService.getCurrentTenant();

    this.tablesService.reset();
    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(tenant);

    const tables = [
      'AnagShipType',
      'AnagShipyard'
    ];
    this.utilsService.getAnagrafiche(tables, this.anagrafiche);

    this.tableSaveSubscription = this.tableMS.onSave.subscribe(
      (result: any) => {
        const updateTables = [result.table.api];
        this.utilsService.getAnagrafiche(updateTables, this.anagrafiche);
      }
    );

    this.shipyardSuggestions$ = new Observable((observer: Observer<string>) => {
      observer.next(this.wUnitaData.shipyard);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          // using github public api to get users by name
          this.tablesService.setQuery(query);
          return this.tablesService.getTable('AnagShipyard')
            .pipe(
              map((data: any) => data && data.items || []),
              tap(() => noop, err => {
                // in case of http error
                this.errorMessage = err && err.message || 'Something goes wrong';
              })
            );
        }

        return of([]);
      })
    );

    // this.shipyardSuggestions$ = this.tablesService.getTableItems('AnagShipyard');

    this.dataForm = new FormGroup({});
  }

  loadData() {
    if (this.unitaId) {
      this.edit = false;
      this.loading = true;
      this.contactsService.getContactTypeAzienda(this.unitaId, 'Unita', null).subscribe(
        (resp: any) => {
          const _unit = this.gridUtils.renameJson(resp);
          this.unitaData = new Unita(_unit);
          this.wUnitaData = new Unita(_unit);
          this.loading = false;
        }
      );
    } else {
      // this.edit = true;
      this.unitaData = new Unita({
        clienteId: this.clientId,
        ragioneSociale: this.trasform ? this.contact?.ragioneSociale : '',
        contattoId: this.trasform ? this.contact.id : 0
      });
      this.wUnitaData = this.unitaData;
      // this.newUnitName = this.contact.ragioneSociale;
    }
  }

  onEdit(event) {
    this.edit = true;
  }

  onSave(event) {
    const body = this.wUnitaData;

    this.unitaService.saveUnita(body, this.trasform).subscribe(
      (response: any) => {
        const _unit = this.gridUtils.renameJson(response);
        this.unitaData = JSON.parse(JSON.stringify(_unit));
        this.wUnitaData = JSON.parse(JSON.stringify(_unit));

        this.notificationService.saved();

        this.edit = !this.edit;
        this.closeEdit.emit({ reload: this.trasform, data: this.wUnitaData });
      },
      (error: any) => {
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      }
    );
  }

  onDelete(event) {
    this.delete.emit(event);
  }

  onCancelEdit(event) {
    if (this.trasform) {
      this.trasform = false;
      this.wUnitaData = null;
      this.unitaData = null;
    } else {
      this.wUnitaData = this.unitaData;
    }
    this.closeEdit.emit({ reload: false, data: this.wUnitaData });
    this.edit = false;
  }

  customSearchFn(term, item) {
    term = term.toLowerCase();
    return item.descrizione.toLowerCase().indexOf(term) > -1;
  }
}
