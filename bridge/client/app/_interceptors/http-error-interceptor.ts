import { Inject, Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retryWhen} from 'rxjs/operators';
import {genericRetryStrategy} from './http-generic-retry-strategy';
import {DtToast} from '@dynatrace/barista-components/toast';
import {Location} from '@angular/common';
import { RETRY_ON_HTTP_ERROR } from '../_utils/app.utils';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  private isReloading = false;

  constructor(private readonly toast: DtToast,
              private readonly location: Location,
              @Inject(RETRY_ON_HTTP_ERROR) private hasRetry: boolean) {
  }

  // tslint:disable-next-line:no-any
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const params = this.hasRetry ? undefined : {maxAttempts: 3, scalingDuration: 0, shouldRetry: () => false};
    return next.handle(request)
      .pipe(
        retryWhen(genericRetryStrategy(params)),
        catchError((error: HttpErrorResponse) => {

          if (error.status === 401) {
            if (!this.isReloading) {
              this.isReloading = true;
              this.toast.create('Login required. Redirecting to login.');
              // Wait for few moments to let user see the toast message and navigate to external login route
              setTimeout(
                () => window.location.href = this.location.prepareExternalUrl('/login'),
                1000
              );
            }
          }
          else if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            this.toast.create(`${error.error.message}`);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`${error.status} ${error.message}`);
            this.toast.create(`${error.error}`);
          }

          return throwError(error);
        })
      );
  }
}
