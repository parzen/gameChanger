import { errorMessages } from 'src/app/shared/error-messages/error-messages';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/shared/validators/email.validator';
import { validateAllFormFields } from 'src/app/shared/validators/validate-all-form-fields';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  errors = errorMessages;
  form: FormGroup;
  private authStatusSub: Subscription = new Subscription();

  constructor(private fb: FormBuilder, public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = this.fb.group({
      email: [null, [Validators.required, emailValidator()]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  onSignup() {
    if (this.form.invalid) {
      validateAllFormFields(this.form);
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      this.form.value.email,
      this.form.value.password
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
