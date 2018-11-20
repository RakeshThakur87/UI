import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

/**
 * Prefixes all requests with `environment.host`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger;
    if (request.headers.get('No-Auth') == "True")
    {
      request = request.clone({ url: environment.host + request.url });
            return next.handle(request.clone());
    }
    if (localStorage.getItem('userToken') != null) {
      const headersConfig = {
        'Authorization': "Bearer " + localStorage.getItem('userToken')
      };  
      const requestf = request.clone({url: environment.host + request.url,setHeaders: headersConfig });
      return next.handle(requestf);
  }
  else {
      //this.router.navigateByUrl('/login');
  }

    // request = request.clone({ url: environment.host + request.url });
    // return next.handle(request);
  }

}
