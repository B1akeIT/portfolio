import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-read-more',
  template: `
    <div [innerHTML]="currentText" (click)="toggleView()"></div>
    <span class="read-more" *ngIf="showToggleButton && (text.length > maxLength)">
      <a (click)="toggleView()">{{ 'APP.BUTTON.read-' + (isCollapsed ? 'more' : 'less') | translate }}</a>
    </span>`
})

export class ReadMoreComponent implements OnChanges {

  @Input() text: string;
  @Input() maxLength: number = 100;
  @Input() showToggleButton: boolean;

  currentText: string;

  public isCollapsed: boolean = true;

  constructor(
    // private elementRef: ElementRef
  ) {

  }
  toggleView() {
    this.isCollapsed = !this.isCollapsed;
    this.determineView();
  }

  determineView() {
    if (this.text.length <= this.maxLength) {
      this.currentText = this.text;
      this.isCollapsed = false;
      return;
    }

    if (this.isCollapsed === true) {
      this.currentText = this.text.substring(0, this.maxLength) + '...';
    } else if (this.isCollapsed === false) {
      this.currentText = this.text;
    }
  }

  ngOnChanges() {
    if (!this.validateSource(this.text)) {
      // throw 'Source must be a string.';
      console.error('Source must be a string.');
    } else {
      this.determineView();
    }
  }

  validateSource(s) {
    if (typeof s !== 'string') {
      return false;
    } else {
      return true;
    }
  }
}
