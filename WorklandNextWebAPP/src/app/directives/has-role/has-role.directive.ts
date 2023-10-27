import { OnInit, Directive, Input, ViewContainerRef, TemplateRef, OnChanges } from '@angular/core';

import { AuthenticationService } from '@app/services/authentication.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit, OnChanges {

  @Input() appHasRole: string;
  @Input() behaviour: 'hide' | 'show' = 'hide';

  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // this.applyStrategy();
  }

  ngOnChanges(changes) {
    this.applyStrategy();
  }

  private applyStrategy() {
    const hasRole = this.authenticationService.hasRole(this.appHasRole);

    if (this.behaviour === 'hide') {
      if (hasRole) {
        if (!this.isVisible) {
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      } else {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    } else {
      if (hasRole) {
        this.isVisible = false;
        this.viewContainerRef.clear();
      } else {
        if (!this.isVisible) {
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
    }
  }
}
