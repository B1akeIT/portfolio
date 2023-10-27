import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/services';
import { NotificationService } from '@app/core/notifications/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api

        this.notificationService.error('APP.MESSAGE.no_authorization', 'APP.TITLE.error');
        setTimeout(() => {
          this.authenticationService.logout();
          this.router.navigate(['/auth/login']);
        }, 3000);
      }

      if ([400, 422].indexOf(err.status) !== -1) {
        // console.log('logout', err.status, err);
      }

      const error = { message: err.message || err.statusText, error: err.error };
      return throwError(error);
    }));
  }
}
