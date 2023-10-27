import { OnInit, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

const breakpoints = {
  xSmall: '(max-width: 599px)',
  small: '(min-width: 600px) and (max-width: 959px)',
  medium: '(min-width: 960px) and (max-width: 1279px)',
  large: '(min-width: 1280px) and (max-width: 1919px)',
  xLarge: '(min-width: 1920px)',
};

@Directive({
  selector: '[appMatches]'
})
export class MatchesDirective implements OnInit {
  @Input() appMatches: keyof typeof breakpoints;

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}

  ngOnInit() {
    const breakpoint = breakpoints[this.appMatches];

    if (matchMedia(breakpoint).matches) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
