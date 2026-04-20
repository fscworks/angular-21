import { Injectable } from '@angular/core';
import { SignUpForm } from '../common/models';

type SignupFieldErrorPath =
  | keyof SignUpForm
  | `address.${keyof SignUpForm['address'] & string}`;

export type SignupResult =
  | { status: 'ok' }
  | {
      status: 'error';
      fieldErrors: Partial<Record<SignupFieldErrorPath, string>>;
    };

@Injectable({ providedIn: 'root' })
export class SignupService {
  async signup(value: SignUpForm): Promise<SignupResult> {
    await new Promise((r) => setTimeout(r, 3000));

    const fieldErrors: Partial<Record<SignupFieldErrorPath, string>> = {};

    if (
      value.address.street.trim().toLowerCase() === 'teststr' &&
      value.address.zip.trim() === '12345'
    ) {
      fieldErrors['address.street'] = 'This street is not allowed.';
      fieldErrors['address.zip'] = 'This ZIP code is not allowed.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { status: 'error', fieldErrors };
    }

    return { status: 'ok' };
  }
}
