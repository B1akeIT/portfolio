import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const accessToken = this.authenticationService.getAuthorizationToken();
    const isLoggedIn = this.authenticationService.isLogged();
    const apiUrl = this.authenticationService.getApiUrl();
    const isApiUrl = request.url.startsWith(apiUrl);
    const isAuthLogin = request.url.endsWith('/login');
    if (isLoggedIn && isApiUrl && !isAuthLogin) {
      const tenant = this.authenticationService.getCurrentTenant();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
          // 'tenant': tenant
        }
      });
    }

    return next.handle(request);
  }
}
