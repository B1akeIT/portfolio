import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

import { PopoverDirective } from 'ngx-bootstrap/popover';

import * as moment from 'moment';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit, OnChanges {

  @Input() dateStart = null;
  @Input() dateEnd = null;

  @Input() options: any = null;

  @Output()
  apply: EventEmitter<any> = new EventEmitter<any>();

  defaultOptions = {
    format: 'dd-MM-yyyy'
  };

  @ViewChild('popFilter') popFilter: PopoverDirective;

  dateStartTemp = null;
  dateEndTemp = null;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.dateStart) {
      this.dateStart = changes.dateStart.currentValue;
      this.dateStartTemp = this.dateStart ? moment(this.dateStart, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;
    }
    if (changes.dateEnd) {
      this.dateEnd = changes.dateEnd.currentValue;
      this.dateEndTemp = this.dateEnd ? moment(this.dateEnd, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;
    }
    if (changes.options) {
      this.options = { ...this.defaultOptions, ...changes.options.currentValue };
    }
  }

  applyData() {
    this.dateStart = this.dateStartTemp;
    this.dateEnd = this.dateEndTemp;

    const data = {
      dateStart: this.dateStart,
      dateEnd: this.dateEnd
    };
    this.apply.emit(data);

    this.popFilter.hide();
  }
}
