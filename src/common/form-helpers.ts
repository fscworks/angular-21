import { FieldState, FieldTree } from '@angular/forms/signals';

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

export function resolveFieldTree<TModel>(
  root: FieldTree<TModel>,
  path: string
): FieldTree<unknown> | undefined {
  let current: unknown = root;

  for (const segment of path.split('.')) {
    if (
      typeof current !== 'function' &&
      (typeof current !== 'object' || current === null)
    ) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === 'function'
    ? (current as FieldTree<unknown>)
    : undefined;
}
