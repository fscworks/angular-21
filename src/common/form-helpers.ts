import { FieldState } from '@angular/forms/signals';

export function focusFirstInvalidField(
  invalidFields: readonly FieldState<unknown, string | number>[]
) {
  const first = invalidFields[0];
  if (!first) return;

  first.focusBoundControl();
}

export function setInvalidFieldsAsTouched(
  invalidFields: readonly FieldState<unknown, string | number>[]
) {
  for (const field of invalidFields) {
    field.markAsTouched();
  }
}
