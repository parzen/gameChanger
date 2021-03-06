import { errorMessages } from 'src/app/shared/error-messages/error-messages';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PwResetService } from '../pw-reset.service';
import { Router } from '@angular/router';
import { emailValidator } from 'src/app/shared/validators/email.validator';
import { validateAllFormFields } from 'src/app/shared/validators/validate-all-form-fields';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['../pw-reset.scss', './request-reset.component.scss'],
})
export class RequestResetComponent implements OnInit {
  form: FormGroup;
  dispError: string;
  dispSuccess: string;
  isLoading: boolean = false;
  errors = errorMessages;

  constructor(
    private pwResetService: PwResetService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, [Validators.required, emailValidator()]],
    });
  }

  requestReset() {
    if (this.form.invalid) {
      validateAllFormFields(this.form);
      return;
    }
    this.isLoading = true;

    this.pwResetService.requestReset(this.form.value.email).subscribe(
      (res) => {
        this.isLoading = false;
        this.form.reset();

        this.dispSuccess = 'Reset password link send to email successfully.';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      (err) => {
        this.isLoading = false;
        this.form.reset();
        if (err.error.message) {
          this.dispError = err.error.message;
        }
      }
    );
  }
}
