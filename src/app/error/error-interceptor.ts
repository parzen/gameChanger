import { SnackbarService } from './../snackbar.service';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RollbarService } from '../app.module';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackBarService: SnackbarService,
    private injector: Injector
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const rollbar = this.injector.get(RollbarService);
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        this.snackBarService.open(errorMessage, true);
        rollbar.error(new Error(error.message).stack);
        return throwError(errorMessage);
      })
    );
  }
}
