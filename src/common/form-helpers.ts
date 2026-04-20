import { FieldState } from '@angular/forms/signals';

export function revealInvalidFields(
  invalidFields: readonly FieldState<unknown, string | number>[]
) {
  for (const field of invalidFields) {
    field.markAsTouched();
  }

  const first = invalidFields[0];
  if (!first) return;

  first.focusBoundControl();
}
