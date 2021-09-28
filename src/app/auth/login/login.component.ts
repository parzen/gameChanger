import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { errorMessages } from 'src/app/shared/error-messages/error-messages';
import { emailValidator } from 'src/app/shared/validators/email.validator';
import { validateAllFormFields } from 'src/app/shared/validators/validate-all-form-fields';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
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

  onLogin() {
    if (this.form.invalid) {
      validateAllFormFields(this.form);
      return;
    }
    this.isLoading = true;
    this.authService.login(this.form.value.email, this.form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
