import { Directive,
    HostListener,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    OnInit,
    AfterViewInit,
    OnChanges } from '@angular/core';

@Directive({
    selector: '[appFit]'
})
export class FitDirective implements OnInit, AfterViewInit, OnChanges {

  private elem: ElementRef;

  @Input() firstChild = false;

  constructor(el: ElementRef) {
    this.elem = el;
  }

  ngOnInit(): void {
    this.resizeLayout();
  }

  ngAfterViewInit(): void {
    this.resizeLayout();
  }

  ngOnChanges(changes: any) {
    if ( changes.firstChild ) {
      this.firstChild = changes.firstChild.currentValue;
    }
  }

  resizeLayout() {
    const pHeight = this.elem.nativeElement.parentElement.offsetHeight;

    this.elem.nativeElement.style.height = pHeight + 'px';
    // console.log('appFit resize', pHeight);
    if ( this.firstChild ) {
      this.elem.nativeElement.firstElementChild.style.height = pHeight + 'px';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: any): void {
    this.resizeLayout();
  }
}
