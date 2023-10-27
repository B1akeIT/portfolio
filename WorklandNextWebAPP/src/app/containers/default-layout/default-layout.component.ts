import {Component} from '@angular/core';

// import { INavData } from '@coreui/angular';
import { INavData } from '@app/components/coreui';
import { navItemsAdmin, navItemsUsers, navItemsDevelop } from '@app/_nav';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { environment } from '@environments/environment';
import { APP_CONST } from '@app/shared';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems: INavData[] = navItemsDevelop;
  public showDevelopMenu = false;

  constructor(
    private translate: TranslateService,
  ) {
    this.navItems =
      (this.showDevelopMenu) ? [...navItemsAdmin, ...navItemsUsers, ...navItemsDevelop] : [...navItemsUsers, ...navItemsDevelop];
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  toggleDevelopMenu(e) {
    this.showDevelopMenu = !this.showDevelopMenu;
    this.navItems =
      (this.showDevelopMenu) ? [...navItemsAdmin, ...navItemsUsers, ...navItemsDevelop] : [...navItemsUsers, ...navItemsDevelop];
  }
}
