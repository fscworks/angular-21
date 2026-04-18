import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  resource,
  inject,
} from '@angular/core';
import {
  form,
  Field,
  required,
  email,
  validate,
  customError,
  FieldState,
  validateTree,
  disabled,
  hidden,
  validateAsync,
  debounce,
  submit,
  ValidationError,
} from '@angular/forms/signals';
import { usernameValidator, passwordValidator } from '../common/validators';
import { AccountTypeEnum, SignUpForm } from '../common/models';
import {
  focusFirstInvalidField,
  setInvalidFieldsAsTouched,
} from '../common/form-helpers';
import { SignupService } from '../services/signup.service';
import { ValidationErrorsComponent } from '../common/validation-errors/validation-errors.component';
import { AddressFormComponent } from '../components/address-form/address-form.component';
import {
  buildAddressSection,
  createAddressModel,
} from '../components/address-form/address-form.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Field, ValidationErrorsComponent, AddressFormComponent],
})
export class FormComponent {
  private readonly signupService = inject(SignupService);

  protected AccountTypeEnum = AccountTypeEnum;

  protected profileUrlPrefix = 'profile/';

  protected model = signal<SignUpForm>({
    username: '',
    email: '',
    accountType: AccountTypeEnum.USER,
    firstname: '',
    lastname: '',

    address: createAddressModel()(),

    canEditUsers: false,
    canEditPersonalInfo: false,
    profileUrl: this.profileUrlPrefix,
    setUserPassword: true,
    password: '',
    passwordConfirm: '',
  });

  protected form = form(this.model, (s) => {
    // Account Details
    required(s.username, { message: 'Please enter a username.' });
    usernameValidator(s.username);
    validateTree(s, (ctx) => {
      return ctx.value().username.toLowerCase() === 'admin' &&
        ctx.value().accountType !== AccountTypeEnum.ADMIN
        ? {
            field: ctx.field.username,
            kind: 'usernameRestricted',
            message: 'Only admin users can be named admin',
          }
        : undefined;
    });
    debounce(s.username, 500);
    validateAsync(s.username, {
      params: ({ value }) => {
        if (!value() || value().length < 3) return undefined;
        return value();
      },
      factory: (username) =>
        resource({
          params: username,
          loader: async ({ params: username }) => {
            return await this.checkUsernameAvailability(username);
          },
        }),
      onSuccess: (result: boolean) => {
        if (!result) {
          return customError({
            kind: 'username_taken',
            message: 'This username is already taken',
          });
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

    // Personal Details
    required(s.firstname, { message: 'Please enter a firstname.' });
    required(s.lastname, { message: 'Please enter a lastname.' });

    // Address
    buildAddressSection(s.address);

    // Settings
    required(s.canEditUsers);
    hidden(
      s.canEditUsers,
      ({ valueOf }) => valueOf(s.accountType) === AccountTypeEnum.USER
    );
    disabled(s.profileUrl);

    // Password
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
  });

  private readonly invalidFields = computed<readonly FieldState<unknown>[]>(
    () => {
      const fields = new Set<FieldState<unknown>>();
      for (const err of this.form().errorSummary()) {
        fields.add(err.field());
      }
      return Array.from(fields);
    }
  );

  constructor() {
    // Whenever username changes, update profileUrl
    effect(() => {
      const username = this.form.username().value().trim().toLocaleLowerCase();
      const profileUrl = this.form.profileUrl().value();

      const url = username ? `${this.profileUrlPrefix}${username}` : profileUrl;

      if (profileUrl !== url && this.form.username().valid()) {
        this.form.profileUrl().setControlValue(url);
      } else if (
        profileUrl.split('/')[1].length > 0 &&
        !this.form.username().valid()
      ) {
        this.form.profileUrl().setControlValue(this.profileUrlPrefix);
      }
    });
  }

  protected onSubmit() {
    if (this.form().invalid()) {
      setInvalidFieldsAsTouched(this.invalidFields());
      focusFirstInvalidField(this.invalidFields());
    } else {
      submit(this.form, async (f) => {
        const value = f().value();
        const result = await this.signupService.signup(value);

        if (result.status === 'error') {
          const errors: ValidationError.WithOptionalField[] = [];

          for (const [key, message] of Object.entries(
            result.fieldErrors ?? {}
          )) {
            if (!message) continue;

            const field = (f as any)[key];
            if (!field) continue;

            errors.push({
              field,
              kind: 'server',
              message,
            });
          }

          return errors.length ? errors : undefined;
        }

        console.log('Submitted:', value);
        return undefined;
      });
    }
  }

  private checkUsernameAvailability(username: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const taken = ['admin', 'system', 'user123'];
        resolve(!taken.includes(username.toLowerCase()));
      }, 2000);
    });
  }
}
