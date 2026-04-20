import { FieldState } from '@angular/forms/signals';

export function focusFirstInvalidField(
  invalidFields: readonly FieldState<unknown, string | number>[]
) {
  const first = invalidFields[0];
  if (!first) return;

  const name = first.name();
  const el = document.querySelector<HTMLElement>(`[name="${name}"]`);
  el?.focus();
}

export function setInvalidFieldsAsTouched(
  invalidFields: readonly FieldState<unknown, string | number>[]
) {
  for (const field of invalidFields) {
    field.markAsTouched();
  }
}
