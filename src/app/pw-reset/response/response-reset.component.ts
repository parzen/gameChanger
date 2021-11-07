import { errorMessages } from 'src/app/shared/error-messages/error-messages';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PwResetService } from '../pw-reset.service';
import { validateAllFormFields } from 'src/app/shared/validators/validate-all-form-fields';

@Component({
  selector: 'app-request-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['../pw-reset.scss', './response-reset.component.scss'],
})
export class ResponseResetComponent implements OnInit {
  form: FormGroup;
  dispError: string;
  dispSuccess: string;
  resetToken: string;
  isLoading: boolean = false;
  isVerified: boolean = false;
  errors = errorMessages;

  constructor(
    private pwResetService: PwResetService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.route.params.subscribe((params) => {
      this.resetToken = params.token;
      this.verifyToken();
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  verifyToken() {
    this.isLoading = true;
    this.pwResetService.validPasswordToken(this.resetToken).subscribe(
      (data) => {
        this.isLoading = false;
        this.isVerified = true;
      },
      (err) => {
        this.isLoading = false;
        this.isVerified = false;
        this.dispError = 'The token is not verified!';
      }
    );
  }

  resetPassword() {
    if (this.form.invalid || !this.isVerified) {
      validateAllFormFields(this.form);
      return;
    }
    this.isLoading = true;

    this.pwResetService
      .newPassword(this.resetToken, this.form.value.newPassword)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.form.reset();
          this.dispSuccess = data.message;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        (err) => {
          if (err.error.message) {
            this.isLoading = false;
            this.form.reset();
            this.dispError = err.error.message;
          }
        }
      );
  }
}
