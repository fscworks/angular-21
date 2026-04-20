import { Injectable } from '@angular/core';
import { SignUpFieldError, SignUpForm } from '../common/models';

const TAKEN_USERNAMES = new Set(['admin', 'system', 'user123']);
const BLOCKED_ADDRESS = {
  street: 'teststr',
  zip: '12345',
} as const;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export type SignupResult =
  | { status: 'ok' }
  | {
      status: 'error';
      errors: readonly SignUpFieldError[];
    };

@Injectable({ providedIn: 'root' })
export class SignupService {
  async signup(value: SignUpForm): Promise<SignupResult> {
    await delay(3000);

    const errors = this.validateAddress(value);

    if (errors.length > 0) {
      return { status: 'error', errors };
    }

    return { status: 'ok' };
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    await delay(2000);
    return !TAKEN_USERNAMES.has(normalize(username));
  }

  private validateAddress(value: SignUpForm): readonly SignUpFieldError[] {
    const { street, zip } = value.address;

    if (
      normalize(street) !== BLOCKED_ADDRESS.street ||
      zip.trim() !== BLOCKED_ADDRESS.zip
    ) {
      return [];
    }

    return [
      {
        path: 'address.street',
        message: 'This street is not allowed.',
      },
      {
        path: 'address.zip',
        message: 'This ZIP code is not allowed.',
      },
    ];
  }
}
