import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NoFutureDatesValidator(): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) { return null; }

    const publishDate = new Date(control.value),
      today = new Date(),
      isValid = publishDate < today;

    return isValid ? null : { 'noFutureDates': 'date is in the future' };
  };
}
