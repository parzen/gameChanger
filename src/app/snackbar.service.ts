import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(public snackBar: MatSnackBar, private zone: NgZone) {}

  public open(
    message: string,
    error = false,
    action = 'close',
    duration = 3000
  ) {
    this.zone.run(() => {
      this.snackBar.open(message, action, {
        duration,
        panelClass: error
          ? ['snackbar-error-style']
          : ['snackbar-success-style'],
      });
    });
  }
}
