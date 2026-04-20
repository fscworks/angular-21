# Angular 21 Playground

This repository is a small Angular 21 playground app for trying out newer
Angular APIs in a realistic form workflow. The app is a create-account form
that demonstrates signal-based form state, reusable form sections, validation,
conditional fields, and submit handling.

## Showcased Features

- **Signal Forms** from `@angular/forms/signals`, including `form()`, `Field`,
  `FieldState`, `FieldTree`, and schema paths.
- **Signal-backed models** with Angular `signal()`, `computed()`, and `effect()`
  used to drive form state and derived values such as the generated profile URL.
- **Built-in field validation** with `required`, `email`, and `pattern`.
- **Custom synchronous validation** with `validate()` and `customError()` for
  username, password, and password confirmation rules.
- **Cross-field and form-tree validation** with `validateTree()` for rules that
  depend on multiple values, such as restricting the `admin` username to admin
  accounts.
- **Async validation** with `validateAsync()`, `debounce()`, and `resource()` to
  simulate username availability checks.
- **Conditional field behavior** with `hidden()` and `disabled()` for account
  permissions, profile URL, and password fields.
- **Nested reusable form components** through the address form component, which
  receives a `FieldTree<Address>` and applies its own validation schema.
- **Validation display components** that read `FieldState` to show touched,
  pending, and error states.
- **Submit handling with server-side errors** using `submit()` and a mock
  `SignupService`.
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

The app uses Angular `21.2.9` packages and TypeScript `5.9`.
