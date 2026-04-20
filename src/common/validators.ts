import { customError, SchemaPath, validate } from '@angular/forms/signals';

export function usernameValidator(field: SchemaPath<string>) {
  validate(field, (ctx) => {
    const value = ctx.value();

    if (!value) {
      return null; // Let required validator handle empty values
    }

    // Must be alphanumeric only
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return customError({
        kind: 'custom',
        message: 'Username must contain only letters and numbers',
      });
    }

    // Must be 3-20 characters
    if (value.length < 3 || value.length > 20) {
      return customError({
        kind: 'custom',
        message: 'Username must be between 3 and 20 characters',
      });
    }

    return null;
  });
}

export function passwordValidator(field: SchemaPath<string>) {
  validate(field, (ctx) => {
    const value = ctx.value();

    if (!value) {
      return null;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S+$/.test(value)) {
      return customError({
        kind: 'custom',
        message:
          'Password must include upper- and lowercase letters, a number, and a special character, and contain no spaces',
      });
    }

    // Must be 3-20 characters
    if (value.length < 6 || value.length > 30) {
      return customError({
        kind: 'custom',
        message: 'Password must be between 6 and 30 characters',
      });
    }

    return null;
  });
}
