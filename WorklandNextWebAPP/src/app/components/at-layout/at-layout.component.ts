import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-at-layout',
  templateUrl: './at-layout.component.html',
  styleUrls: [ './at-layout.component.scss' ]
})
export class ATLayoutComponent implements OnChanges {

  @Input() class = 'primary';
  @Output()
  changed: EventEmitter<string> = new EventEmitter<string>();

  currentTenant: any = null;

  ngOnChanges(changes: any) {
    if (changes.class) {
      this.class = changes.class.currentValue;
    }
  }

  menuSelected(tenant: any) {
    this.currentTenant = tenant;
    this.changed.emit(this.currentTenant);
  }

  clearMenu() {
    this.menuSelected(null);
  }
}
