import { Directive,
  HostListener,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit } from '@angular/core';

@Directive({
    selector: '[appFlexLayout]'
})
export class FlexLayoutDirective implements OnInit, AfterViewInit {

  @Input() header = 0;
  @Input() footer = 0;

  private elem: ElementRef;

  constructor(el: ElementRef) {
    this.elem = el;
  }

  ngOnInit(): void {
    this.resizeLayout();
  }

  ngAfterViewInit(): void {
    this.resizeLayout();
  }

  resizeLayout() {
    let newHeight = window.innerHeight + 1;
    if ( this.header ) {
        newHeight = newHeight - this.header;
    }
    if ( this.footer ) {
        newHeight = newHeight - this.footer;
    }
    this.elem.nativeElement.style.height = newHeight + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: any): void {
      this.resizeLayout();
  }
}
