import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const emailCorrect = regularExpression.test(String(control.value).toLowerCase());
    return emailCorrect ? null : {wrongEmail: {value: control.value}};
  };
}
