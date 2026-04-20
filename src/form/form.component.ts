import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
  resource,
  inject,
} from '@angular/core';
import {
  form,
  FormField,
  required,
  email,
  validate,
  FieldState,
  FieldTree,
  SchemaPathTree,
  validateTree,
  disabled,
  hidden,
  validateAsync,
  debounce,
  submit,
  ValidationError,
} from '@angular/forms/signals';
import { usernameValidator, passwordValidator } from '../common/validators';
import {
  ACCOUNT_TYPE_OPTIONS,
  AccountTypeEnum,
  createSignUpForm,
  PROFILE_URL_PREFIX,
  SignUpFieldError,
  SignUpForm,
  SignUpFormFieldPath,
} from '../common/models';
import { revealInvalidFields } from '../common/form-helpers';
import { SignupService } from '../services/signup.service';
import { ValidationErrorsComponent } from '../common/validation-errors/validation-errors.component';
import { AddressFormComponent } from '../components/address-form/address-form.component';
import { buildAddressSection } from '../components/address-form/address-form.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, ValidationErrorsComponent, AddressFormComponent],
})
export class FormComponent {
  private readonly signupService = inject(SignupService);

  protected readonly accountTypeOptions = ACCOUNT_TYPE_OPTIONS;

  protected readonly model = signal<SignUpForm>(createSignUpForm());

  protected readonly form = form(this.model, (s) => this.buildFormSchema(s));

  private readonly serverErrorFields: Record<
    SignUpFormFieldPath,
    () => FieldTree<unknown>
  > = {
    username: () => this.asUnknownField(this.form.username),
    email: () => this.asUnknownField(this.form.email),
    accountType: () => this.asUnknownField(this.form.accountType),
    firstname: () => this.asUnknownField(this.form.firstname),
    lastname: () => this.asUnknownField(this.form.lastname),
    'address.street': () => this.asUnknownField(this.form.address.street),
    'address.city': () => this.asUnknownField(this.form.address.city),
    'address.house': () => this.asUnknownField(this.form.address.house),
    'address.zip': () => this.asUnknownField(this.form.address.zip),
    canEditUsers: () => this.asUnknownField(this.form.canEditUsers),
    canEditPersonalInfo: () =>
      this.asUnknownField(this.form.canEditPersonalInfo),
    profileUrl: () => this.asUnknownField(this.form.profileUrl),
    setUserPassword: () => this.asUnknownField(this.form.setUserPassword),
    password: () => this.asUnknownField(this.form.password),
    passwordConfirm: () => this.asUnknownField(this.form.passwordConfirm),
  };

  constructor() {
    effect(() => this.syncProfileUrlWithUsername());
  }

  protected async onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    await submit(this.form, {
      onInvalid: () => this.revealCurrentInvalidFields(),
      action: (f) => this.submitSignUpForm(f),
    });
  }

  private buildFormSchema(s: SchemaPathTree<SignUpForm>): void {
    this.addAccountRules(s);
    this.addPersonalRules(s);
    buildAddressSection(s.address);
    this.addSettingsRules(s);
    this.addPasswordRules(s);
  }

  private addAccountRules(s: SchemaPathTree<SignUpForm>): void {
    required(s.username, { message: 'Please enter a username.' });
    usernameValidator(s.username);
    validateTree(s, (ctx) => {
      return ctx.value().username.toLowerCase() === 'admin' &&
        ctx.value().accountType !== AccountTypeEnum.ADMIN
        ? {
            fieldTree: ctx.fieldTreeOf(s.username),
            kind: 'usernameRestricted',
            message: 'Only admin users can be named admin',
          }
        : undefined;
    });
    debounce(s.username, 500);
    validateAsync(s.username, {
      params: ({ value }) => {
        const username = value().trim();
        return username.length < 3 ? undefined : username;
      },
      factory: (username) =>
        resource({
          params: username,
          loader: ({ params }) =>
            this.signupService.isUsernameAvailable(params),
        }),
      onSuccess: (result: boolean) => {
        if (!result) {
          return {
            kind: 'username_taken',
            message: 'This username is already taken',
          };
        }
        return null;
      },
      onError: (error: unknown) => {
        console.error('Async validation error:', error);
        return null;
      },
    });

    required(s.email, { message: 'Please enter an email address.' });
    email(s.email, { message: 'Please enter a valid email.' });

    required(s.accountType, { message: 'Please select an account type.' });
  }

  private addPersonalRules(s: SchemaPathTree<SignUpForm>): void {
    required(s.firstname, { message: 'Please enter a firstname.' });
    required(s.lastname, { message: 'Please enter a lastname.' });
  }

  private addSettingsRules(s: SchemaPathTree<SignUpForm>): void {
    required(s.canEditUsers);
    hidden(
      s.canEditUsers,
      ({ valueOf }) => valueOf(s.accountType) === AccountTypeEnum.USER
    );
    disabled(s.profileUrl);
  }

  private addPasswordRules(s: SchemaPathTree<SignUpForm>): void {
    required(s.password, { message: 'Please enter a password.' });
    passwordValidator(s.password);
    required(s.passwordConfirm, { message: 'Please confirm the password.' });
    disabled(s.password, ({ valueOf }) => !valueOf(s.setUserPassword));
    disabled(s.passwordConfirm, ({ valueOf }) => !valueOf(s.setUserPassword));
    validate(s.passwordConfirm, ({ value, valueOf }) => {
      return value() !== valueOf(s.password)
        ? {
            kind: 'passwordMismatch',
            message: 'The passwords do not match...',
          }
        : null;
    });
  }

  private syncProfileUrlWithUsername(): void {
    const username = this.form.username().value().trim().toLowerCase();
    const profileUrl = this.form.profileUrl().value();

    if (!this.form.username().valid()) {
      if (profileUrl !== PROFILE_URL_PREFIX) {
        this.form.profileUrl().controlValue.set(PROFILE_URL_PREFIX);
      }
      return;
    }

    if (!username) return;

    const nextProfileUrl = `${PROFILE_URL_PREFIX}${username}`;
    if (profileUrl !== nextProfileUrl) {
      this.form.profileUrl().controlValue.set(nextProfileUrl);
    }
  }

  private async submitSignUpForm(
    f: FieldTree<SignUpForm>
  ): Promise<readonly ValidationError.WithOptionalFieldTree[] | undefined> {
    const result = await this.signupService.signup(f().value());

    if (result.status === 'ok') {
      return undefined;
    }

    return result.errors.map((error) => this.toServerValidationError(error));
  }

  private toServerValidationError(
    error: SignUpFieldError
  ): ValidationError.WithOptionalFieldTree {
    return {
      fieldTree: this.serverErrorFields[error.path](),
      kind: 'server',
      message: error.message,
    };
  }

  private revealCurrentInvalidFields(): void {
    revealInvalidFields(this.getInvalidFields());
  }

  private getInvalidFields(): readonly FieldState<unknown>[] {
    const fields = new Set<FieldState<unknown>>();

    for (const error of this.form().errorSummary()) {
      fields.add(error.fieldTree());
    }

    return Array.from(fields);
  }

  private asUnknownField<T>(fieldTree: FieldTree<T>): FieldTree<unknown> {
    return fieldTree as unknown as FieldTree<unknown>;
  }
}
