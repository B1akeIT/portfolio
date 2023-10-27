import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-textbox',
  templateUrl: './filter-textbox.component.html',
  styleUrls: [ './filter-textbox.component.scss' ]
})
export class FilterTextboxComponent {

  model: { filter: string } = { filter: null };

  @Output()
  changed: EventEmitter<string> = new EventEmitter<string>();

  prevFilter = '';

  filterChanged(event: any) {
    event.preventDefault();
    this.prevFilter = this.model.filter;
    this.changed.emit(this.model.filter); // Raise changed event
  }

  clearFilter(event: any) {
    event.preventDefault();
    this.model.filter = '';
    this.prevFilter = '';
    this.changed.emit(this.model.filter);
  }
}
