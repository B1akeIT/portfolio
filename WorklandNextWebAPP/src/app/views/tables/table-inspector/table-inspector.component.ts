import { Component, OnInit, Input, OnChanges, Output, EventEmitter }	from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ValidationService } from '@app/extensions/formly/validation.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { TablesService } from '../tables.service';
import { TenantsService } from '@app/views/tenants/tenants.service';
import { EventsManagerService } from '@app/services/eventsmanager.service';
import { NotificationService } from '@app/core/notifications/notification.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-table-inspector',
  templateUrl: './table-inspector.component.html',
  styleUrls: ['./table-inspector.component.scss']
})
export class TableInspectorComponent implements OnInit, OnChanges {

  @Input() table = null;
  @Input() tableId = null;

  @Input() showEdit = false;
  @Input() showIcon = true;
  @Input() showLabel = false;

  @Output()
  status: EventEmitter<string> = new EventEmitter<string>();

  data = null;

  loading = false;
  loadingTenants = false;
  loadingOptions = APP_CONST.loadingOptions;
  modified = false;
  isAddNew = false;
  tableStatus = 'view';

  error = false;
  errorMessage = '';

  showAnimation = true;
  options: AnimationOptions = {
    path: '/assets/animations/finger-click.json',
    loop: false
  };

  excluded = APP_CONST.fieldExcluded;

  constructor(
    private tablesService: TablesService,
    private gridUtils: GridUtils,
    private tenantsService: TenantsService,
    private eventsManagerService: EventsManagerService,
    private notificationService: NotificationService
  ) {
    this.initData();
  }

  ngOnChanges(changes: any) {
    if (changes.table ) {
      this.table = changes.table.currentValue;
      // this.loadTableData();
    }
    if (changes.tableId ) {
      this.tableId = changes.tableId.currentValue;
      // this.loadTableData();
    }
  }

  ngOnInit() {
    this.initData();
  }

  initData() {
    // Init data
  }

  clearData() {
    this.tableStatus = 'view';
    this.error = false;
    this.errorMessage = '';
    this.data = null;
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadTableData() {
    if (this.table && this.tableId && (this.table.model !== 'Iva')) {
      this.loading = true;
      // Get table element
      this.tablesService.getTableId(this.table.api, this.tableId).subscribe(
        (response: any) => {
          this.data = this.gridUtils.renameJson(response);
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = error.message;
        }
      );
    } else {
      this.clearData();
    }
  }

  getTableField(field, html = true) {
    let result = '---';

    let wa = null;

    switch (field) {
      case 'phone':
      case 'mobile':
      case 'email':
      case 'pec':
        wa = (this.data && this.data[field]) ? this.data[field] : null;
        if (wa) {
          if (html) {
            result = '<span class="badge badge- d-none">' + field + '</span>' + ' <span>' + wa + '</span>';
          } else {
            result = wa;
          }
        }
        break;

      case 'website':
        wa = (this.data && this.data[field]) ? this.data[field] : null;
        if (wa) {
          if (html) {
            result = '<a href="' + wa + '" target="_new">';
            result += '<span class="badge badge-light">' + field + '</span>' + ' <span>' + wa + '</span></a>';
          } else {
            result = wa;
          }
        }
        break;
    }

    return result;
  }

  isEditNew() {

  }

  onAdd() {
    this.tableStatus = 'edit';
    this.tableId = 0;
    // Deselect ag-grid current element
    this.status.emit(this.tableStatus);
  }

  onEdit() {
    (this.tableStatus === 'edit') ? this.tableStatus = 'view' : this.tableStatus = 'edit';
    if (this.tableId === 0) { this.status.emit(this.tableStatus); }
  }

  onClodeEdit(event) {
    this.tableStatus = 'view';
    if (!this.tableId) { this.status.emit(this.tableStatus); }
    if (event) {
      this.tableId = event.id;
    }
  }

  onDelete(confirm) {
    // Delete table item
    console.log('onDelete', this.table.model, this.tableId);
  }
}
