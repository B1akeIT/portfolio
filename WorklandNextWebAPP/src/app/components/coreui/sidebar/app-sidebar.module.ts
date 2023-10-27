import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { LayoutModule } from '../shared/layout/layout.module';
// App Sidebar Component
import { AppSidebarComponent } from './app-sidebar.component';
import { AppSidebarFooterComponent } from './app-sidebar-footer.component';
import { AppSidebarFormComponent } from './app-sidebar-form.component';
import { AppSidebarHeaderComponent } from './app-sidebar-header.component';
import { AppSidebarMinimizerComponent } from './app-sidebar-minimizer.component';
import { AppSidebarService  } from './app-sidebar.service';

// App SidebarNav Component
import { NavDropdownDirective, NavDropdownToggleDirective } from './app-sidebar-nav.directive';
import { AppSidebarNavComponent } from './app-sidebar-nav.component';
import { AppSidebarNavDividerComponent } from './app-sidebar-nav/app-sidebar-nav-divider.component';
import { AppSidebarNavDropdownComponent } from './app-sidebar-nav/app-sidebar-nav-dropdown.component';
import { AppSidebarNavItemsComponent } from './app-sidebar-nav/app-sidebar-nav-items.component';
import { AppSidebarNavLinkComponent, AppSidebarNavLinkContentComponent } from './app-sidebar-nav/app-sidebar-nav-link.component';
import { AppSidebarNavTitleComponent } from './app-sidebar-nav/app-sidebar-nav-title.component';
import { SidebarNavHelper } from './app-sidebar-nav.service';
import { AppSidebarNavLabelComponent } from './app-sidebar-nav/app-sidebar-nav-label.component';
import { AppSidebarNavIconPipe } from './app-sidebar-nav/app-sidebar-nav-icon.pipe';
import { AppSidebarNavBadgePipe } from './app-sidebar-nav/app-sidebar-nav-badge.pipe';
import { AppSidebarNavLinkPipe } from './app-sidebar-nav/app-sidebar-nav-link.pipe';
import { AppSidebarNavItemClassPipe } from './app-sidebar-nav/app-sidebar-nav-item-class.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LayoutModule
  ],
  exports: [
    AppSidebarFooterComponent,
    AppSidebarFormComponent,
    AppSidebarHeaderComponent,
    AppSidebarMinimizerComponent,
    AppSidebarComponent,
    AppSidebarNavItemsComponent,
    AppSidebarNavComponent,
    AppSidebarNavDividerComponent,
    AppSidebarNavDropdownComponent,
    AppSidebarNavLabelComponent,
    AppSidebarNavLinkComponent,
    AppSidebarNavLinkContentComponent,
    AppSidebarNavTitleComponent,
    NavDropdownDirective,
    NavDropdownToggleDirective,
    LayoutModule
  ],
  declarations: [
    AppSidebarFooterComponent,
    AppSidebarFormComponent,
    AppSidebarHeaderComponent,
    AppSidebarMinimizerComponent,
    AppSidebarMinimizerComponent,
    AppSidebarComponent,
    AppSidebarNavItemsComponent,
    AppSidebarNavComponent,
    AppSidebarNavDividerComponent,
    AppSidebarNavDropdownComponent,
    AppSidebarNavLinkComponent,
    AppSidebarNavLinkContentComponent,
    AppSidebarNavTitleComponent,
    NavDropdownDirective,
    NavDropdownToggleDirective,
    AppSidebarNavLabelComponent,
    AppSidebarNavIconPipe,
    AppSidebarNavBadgePipe,
    AppSidebarNavLinkPipe,
    AppSidebarNavItemClassPipe
  ],
  providers: [
    SidebarNavHelper,
    AppSidebarService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppSidebarModule { }
