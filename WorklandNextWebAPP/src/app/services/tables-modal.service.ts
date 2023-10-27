import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { TablesService } from '@app/views/tables/tables.service';

import { ModalTableManagerComponent } from '@app/components/modal-table-manager/modal-table-manager.component';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class TableModalService {

  modalTableRef: BsModalRef;
  currentTable = null;
  tables = null;

  onSave: Subject<any>;

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService,
    private tablesService: TablesService,
  ) {
    this.onSave = new Subject();

    this.loadTables();
  }

  loadTables() {
    this.tablesService.getTables().subscribe(
      (resp: any) => {
        this.tables = resp.data;
      }
    );
  }

  openTableModal(model) {
    const $this = this;
    // Get table from model
    this.currentTable = _.find(this.tables, function (o) { return o.model === model; });

    const initialState = {
      table: this.currentTable,
      tables: this.tables,
      showTableDropdown: false
    };

    this.modalTableRef = this.modalService.show(ModalTableManagerComponent, {
      ignoreBackdropClick: false,
      class: 'modal-half',
      initialState: initialState,
      animated: true
    });
    this.modalTableRef.content.onClose.subscribe(
      (result: any) => {
        this.currentTable = null;
      }
    );
    this.modalTableRef.content.onSave.subscribe(
      (result: any) => {
        this.onSave.next(result);
      }
    );
  }
}
