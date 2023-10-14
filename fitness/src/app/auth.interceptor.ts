import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    /*if (request.url.endsWith('/user/login') || request.url.endsWith('/user/register')) {
      return next.handle(request);
    }


    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer YOUR_TOKEN_HERE`
      }
    });

    return next.handle(modifiedRequest);*/
    return next.handle(request);
  }
}
