import { errorMessages } from 'src/app/shared/error-messages/error-messages';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PwResetService } from '../pw-reset.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.css'],
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
      newPassword: ['', Validators.required],
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
        this.dispError = "The token is not verified!";
      }
    );
  }

  resetPassword() {
    if (this.form.invalid || !this.isVerified) {
      this.validateAllFormFields(this.form);
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

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
