import { SnackbarService } from './../snackbar.service';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBarService: SnackbarService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unkown error occurred!"
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        this.snackBarService.open(errorMessage, "Close", true)
        return throwError(error);
      })
    );
  }
}
