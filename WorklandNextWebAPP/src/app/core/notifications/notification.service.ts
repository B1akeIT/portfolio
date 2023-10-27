import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { SnotifyPosition, SnotifyService, SnotifyToastConfig } from 'ng-snotify';

import { APP_CONST } from '@app/shared/const';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class NotificationService {
  constructor(
    private translateService: TranslateService,
    private snotifyService: SnotifyService
  ) {
    this.snotifyService.setDefaults({
      global: {
        newOnTop: true,
        maxAtPosition: 6,
        maxOnScreen: 8,
        filterDuplicates: true
      }
    });
  }

  default(message: string, title: string = 'APP.TITLE.empty') {
    const tMessage = this.translateService.instant(message);
    const tTitle = this.translateService.instant(title);
    this.snotifyService.simple(tMessage, tTitle, {
      ...APP_CONST.snotify_options,
      ...{ type: 'simple' }
    });
  }

  info(message: string, title: string = 'APP.TITLE.empty') {
    const tMessage = this.translateService.instant(message);
    const tTitle = this.translateService.instant(title);
    this.snotifyService.info(tMessage, tTitle, {
      ...APP_CONST.snotify_options,
      ...{ type: 'info' }
    });
  }

  success(message: string, title: string = 'APP.TITLE.empty') {
    const tMessage = this.translateService.instant(message);
    const tTitle = this.translateService.instant(title);
    this.snotifyService.success(tMessage, tTitle, {
      ...APP_CONST.snotify_options,
      ...{ type: 'success' }
    });
  }

  warn(message: string, title: string = 'APP.TITLE.empty') {
    const tTitle = this.translateService.instant(title);
    const tMessage = this.translateService.instant(message);
    this.snotifyService.warning(tMessage, tTitle, {
      ...APP_CONST.snotify_options,
      ...{ type: 'warning' }
    });
  }

  error(message: string, title: string = 'APP.TITLE.empty') {
    const tMessage = this.translateService.instant(message);
    const tTitle = this.translateService.instant(title);
    this.snotifyService.error(tMessage, tTitle, {
      ...APP_CONST.snotify_options,
      ...{ type: 'error' }
    });
  }

  saved() {
    const tTitle = this.translateService.instant('APP.MESSAGE.saved');
    const tMessage = this.translateService.instant('APP.MESSAGE.saved_message');
    this.snotifyService.success(tMessage, tTitle, {
      ...APP_CONST.snotify_options,
      ...{ type: 'success' }
    });
  }

  deleted() {
    const tTitle = this.translateService.instant('APP.MESSAGE.deleted');
    const tMessage = this.translateService.instant('APP.MESSAGE.deletion_successful');
    this.snotifyService.success(tMessage, tTitle, {
      ...APP_CONST.snotify_options,
      ...{ type: 'success' }
    });
  }
}
