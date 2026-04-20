export enum AccountTypeEnum {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export interface Address {
  street: string;
  city: string;
  house: string;
  zip: string;
}

export interface SignUpForm {
  username: string;
  email: string;
  accountType: AccountTypeEnum;
  firstname: string;
  lastname: string;

  address: Address;

  canEditUsers: boolean;
  canEditPersonalInfo: boolean;
  profileUrl: string;
  setUserPassword: boolean;
  password: string;
  passwordConfirm: string;
}

export const PROFILE_URL_PREFIX = 'profile/';

export const ACCOUNT_TYPE_OPTIONS = [
  { value: AccountTypeEnum.USER, label: 'User' },
  { value: AccountTypeEnum.MODERATOR, label: 'Moderator' },
  { value: AccountTypeEnum.ADMIN, label: 'Admin' },
] as const;

export type SignUpFormFieldPath =
  | Exclude<keyof SignUpForm, 'address'>
  | `address.${keyof Address & string}`;

export interface SignUpFieldError {
  path: SignUpFormFieldPath;
  message: string;
}

export function createAddress(): Address {
  return {
    street: '',
    city: '',
    house: '',
    zip: '',
  };
}

export function createSignUpForm(): SignUpForm {
  return {
    username: '',
    email: '',
    accountType: AccountTypeEnum.USER,
    firstname: '',
    lastname: '',
    address: createAddress(),
    canEditUsers: false,
    canEditPersonalInfo: false,
    profileUrl: PROFILE_URL_PREFIX,
    setUserPassword: true,
    password: '',
    passwordConfirm: '',
  };
}
