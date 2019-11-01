import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NoTrackingTokenValidator(): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } => {
    const url = (control.value || ''),
      isValid = url.indexOf('utm_') === -1;

    return isValid ? null : { 'urlTrackingTokens': 'tracking tokens are not allowed' };
  };
}
