import { AbstractControl, ValidatorFn } from '@angular/forms';

export function UrlProtocolValidator(): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } => {
    if (control.value === null) { return null; }

    const url = control.value.toLocaleLowerCase(),
      isValid = url.substring(0, 7) === 'http://' ||
        url.substring(0, 8) === 'https://';

    return isValid ? null : { 'invalidProtocol': 'url protocol is invalid or missing' };
  };
}
