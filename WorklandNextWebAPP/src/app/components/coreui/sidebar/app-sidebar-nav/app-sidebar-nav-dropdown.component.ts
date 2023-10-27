import { Component, Input } from '@angular/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { SidebarNavHelper } from '../app-sidebar-nav.service';

@Component({
  selector: 'app-sidebar-nav-dropdown, cui-sidebar-nav-dropdown',
  template: `
    <div class="nav-title nav-dropdown-toggle" appNavDropdownToggle
      [appHtmlAttr]="item.attributes">
      <i *ngIf="helper.hasIcon(item)" [ngClass]="item | appSidebarNavIcon"></i>
      <ion-icon *ngIf="helper.hasIonicon(item)" class="nav-icon" [name]="item.ionicon"></ion-icon>
      <ng-container>{{ item.name | translate }}</ng-container>
      <span *ngIf="helper.hasBadge(item)" [ngClass]="item | appSidebarNavBadge">{{ item.badge.text }}</span>
    </div>
    <!-- <a class="nav-title nav-link nav-dropdown-toggle"
      appNavDropdownToggle
      [appHtmlAttr]="item.attributes">
      <i *ngIf="helper.hasIcon(item)" [ngClass]="item | appSidebarNavIcon"></i>
      <ion-icon *ngIf="helper.hasIonicon(item)" class="nav-icon" [name]="item.ionicon"></ion-icon>
      <ng-container>{{ item.name | translate }}</ng-container>
      <span *ngIf="helper.hasBadge(item)" [ngClass]="item | appSidebarNavBadge">{{ item.badge.text }}</span>
    </a> -->
    <app-sidebar-nav-items
      class="nav-dropdown-items"
      [items]="item.children">
    </app-sidebar-nav-items>
  `,
  styles: [
    '.nav-dropdown-toggle { cursor: pointer; }',
    '.nav-dropdown-items { display: block; }'
  ],
  providers: [ SidebarNavHelper ]
})
export class AppSidebarNavDropdownComponent {
  @Input() item: any;

  constructor(
    public auth: AuthenticationService,
    public helper: SidebarNavHelper
  ) { }
}
