import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { EventsManagerService } from '@app/services/eventsmanager.service';
import { TablesService } from '../../views/tables/tables.service';

import { DynamicClass } from '@app/models';

import { APP_CONST } from '@app/shared/const';

@Component({
  selector: 'app-table-field-view',
  templateUrl: './table-field-view.component.html',
  styleUrls: ['./table-field-view.component.scss']
})
export class TableFieldViewComponent implements OnInit, OnChanges {

  @Input() id = 0;
  @Input() table = '';
  @Input() tableApi = '';
  @Input() field = null;
  @Input() class = 'view';

  loading = false;
  error = false;
  errorMessage = '';

  loadingOptions = APP_CONST.loadingOptions;

  data = null;

  constructor(
    private eventsManagerService: EventsManagerService,
    private tablesService: TablesService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.id) {
      this.id = changes.id.currentValue;
      this.loadTableData();
    }
    if (changes.class) {
      this.class = changes.status.currentValue;
    }
  }

  loadTableData() {
    this.data = null;
    if (this.id) {
      this.loading = true;
      // Get table element
      this.tablesService.getTableId(this.tableApi, this.id).subscribe(
        (response: any) => {
          this.data = response;
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
}
