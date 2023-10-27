import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { delay } from 'rxjs/operators';

import { EventsManagerService } from '@app/services/eventsmanager.service';
import { GridUtils } from '@app/utils/grid-utils';
import { TablesService } from '../../views/tables/tables.service';

import { DynamicClass } from '@app/models';

import { APP_CONST } from '@app/shared/const';

@Component({
  selector: 'app-table-model-view',
  templateUrl: './table-model-view.component.html',
  styleUrls: ['./table-model-view.component.scss']
})
export class TableModelViewComponent implements OnInit, OnChanges {

  @Input() id = 0;
  @Input() table = '';
  @Input() tableApi = '';
  @Input() status = 'view';

  @Output()
  close: EventEmitter<string> = new EventEmitter<string>();

  loading = false;
  error = false;
  errorMessage = '';

  loading_saving = false;
  loadingOptions = APP_CONST.loadingOptions;

  data = null;

  dataForm: FormGroup;
  dataModel: any;
  dataFields: Array<FormlyFieldConfig>;
  optionsForm: FormlyFormOptions;

  excluded = APP_CONST.fieldExcluded;

  constructor(
    private eventsManagerService: EventsManagerService,
    private tablesService: TablesService,
    private gridUtils: GridUtils
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.id) {
      this.id = changes.id.currentValue;
      this.loadTableData();
    }
    if (changes.status) {
      this.status = changes.status.currentValue;
      if (this.status === 'edit') { this.onEdit(); }
    }
  }

  loadTableData() {
    this.data = null;
    if (this.id) {
      this.loading = true;
      this.tablesService.getTableId(this.tableApi, this.id).subscribe(
        (response: any) => {
          // this.data = response;
          this.data = this.gridUtils.renameJson(response);
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

  onEdit() {
    let modifiedFields = [];
    let additionalFields = [];

    this.dataForm = new FormGroup({});
    if (this.id !== 0) {
      try {
        this.dataModel = new DynamicClass(this.table, this.data);
      } catch (e) {
        console.error(e);
      }
      modifiedFields = [];
      additionalFields = [];
    } else {
      try {
        this.dataModel = new DynamicClass(this.table, {});
      } catch (e) {
        console.error(e);
      }
      modifiedFields = [];
      additionalFields = [];
    }

    const replacedItems = this.dataModel.formField().map(x => {
      const item = modifiedFields.find(({ key }) => key === x.key);
      return item ? item : x;
    });
    // if (this.id !== 0) { replacedItems.pop(); }
    this.dataFields = [...replacedItems, ...additionalFields];

    this.status = 'edit';
  }

  onSave(data) {
    // Set new data returned from save
    let saveObs = null;

    this.loading_saving = true;

    if (data.id === 0) {
      saveObs = this.tablesService.saveTable(this.tableApi, data);
    } else {
      saveObs = this.tablesService.updateTable(this.tableApi, this.id, data);
    }

    saveObs.subscribe(
      (resp: any) => {
        this.data = resp;
        this.loading_saving = false;

        this.status = 'view';
        this.close.emit(this.data);
        this.eventsManagerService.broadcast(APP_CONST.tableUpdateEvent, this.data);
      },
      (error: any) => {
        this.loading_saving = false;
        this.error = true;
        this.errorMessage = error.message;

        this.status = 'view';
        this.close.emit(null);
      }
    );
  }

  closeEdit() {
    this.close.emit(null);
  }
}
