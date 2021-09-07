import { SnackbarService } from './../../snackbar.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { PwResetService } from '../pw-reset.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css'],
})
export class RequestResetComponent implements OnInit {
  form: FormGroup;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean = false;

  constructor(
    private pwResetService: PwResetService,
    private snackbarService: SnackbarService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: [null,  [Validators.required, Validators.email]],
    });
  }

  requestReset() {
    console.log(this.form);
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      return;
    }
    this.isLoading = true;

    console.log(this.form.value.email)
    this.pwResetService.requestReset(this.form.value.email).subscribe(
      (res) => {
        this.isLoading = false;
        this.form.reset();
        this.snackbarService.open(
          'Reset password link send to email successfully.'
        );

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      (err) => {
        this.isLoading = false;
        this.form.reset();
        if (err.error.message) {
          this.snackbarService.open(err.error.message, false);
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
