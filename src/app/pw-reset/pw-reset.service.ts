import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'api/resetpassword';

@Injectable({ providedIn: 'root' })
export class PwResetService {
  constructor(private http: HttpClient) {}

  requestReset(email: string): Observable<any> {
    return this.http.post(`${BACKEND_URL}/req-reset-password`, {
      email: email,
    });
  }

  newPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${BACKEND_URL}/new-password`, {
      resettoken: token,
      newPassword: newPassword,
    });
  }

  validPasswordToken(token: string): Observable<any> {
    return this.http.post(`${BACKEND_URL}/valid-password-token`, {
      resettoken: token,
    });
  }
}
