import { Injectable } from '@angular/core';
import { SignUpForm } from '../common/models';

export type SignupResult =
  | { status: 'ok' }
  | {
      status: 'error';
      fieldErrors: Partial<Record<keyof SignUpForm, string>>;
    };

@Injectable({ providedIn: 'root' })
export class SignupService {
  async signup(value: SignUpForm): Promise<SignupResult> {
    await new Promise((r) => setTimeout(r, 3000));

    const fieldErrors: Partial<Record<keyof SignUpForm, string>> = {};

    if (
      value.address.street.trim().toLowerCase() === 'seligmannallee' &&
      value.address.zip.trim().toLowerCase() !== '30173'
    ) {
      //fieldErrors.street = 'Thats not a valid street.';
      //fieldErrors.zip = 'ZIP does not match.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { status: 'error', fieldErrors };
    }

    return { status: 'ok' };
  }
}
