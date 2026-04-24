# Angular 21 Playground

This repository contains a small Angular `21.2.9` playground app focused on
signal-based forms and modern standalone Angular APIs. The demo is a
create-account flow with nested form sections, sync and async validation,
conditional UI, and mocked server-side submit errors.

## Showcased Features

- **Signal Forms** from `@angular/forms/signals`, including `form()`,
  `FormField`, `FieldState`, `FieldTree`, schema paths, `submit()`,
  `validateAsync()`, `hidden()`, and `disabled()`.
- **Signal-driven form state** with Angular `signal()`, `effect()`, and
  `resource()` used for derived values such as the generated profile URL and
  debounced username availability checks.
- **Built-in field validation** with `required()` and `email()`.
- **Custom synchronous validation** with `validate()` for username, password,
  and password-confirmation rules.
- **Cross-field and form-tree validation** with `validateTree()` for rules that
  depend on multiple values, such as restricting the `admin` username to admin
  accounts.
- **Nested reusable form components** through `AddressFormComponent`, which
  receives a `FieldTree<Address>` and applies its own validation schema.
- **Validation display components** that surface touched, pending, local, and
  server-side error states.
- **Global signal-form field classes** via `provideSignalFormsConfig()`.
- **Zoneless change detection** with `provideZonelessChangeDetection()` and
  `ChangeDetectionStrategy.OnPush`.
- **Modern Angular template control flow** with `@let`, `@if`, and `@for`.

## Running the App

Install dependencies and start the development server:

```sh
npm install
npm start
```

The dev server runs the `demo` application defined in `angular.json`.

## Build

Create a production build with:

```sh
npm run build
```

The output is written to `dist/demo`.

## Version Notes

- Angular runtime packages: `21.2.9`
- `@angular/compiler-cli`: `21.2.9`
- Angular CLI and build tooling: `21.2.7`
- TypeScript: `^5.9.0`

## Demo Notes

- The mock async username check marks `admin`, `system`, and `user123` as
  unavailable.
- Submitting the blocked address `Teststr` with ZIP code `12345` returns mocked
  server-side field errors.
