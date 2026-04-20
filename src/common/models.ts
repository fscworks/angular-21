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

type PrimitiveFieldValue = string | number | boolean | null | undefined;

export type FieldPath<T> = {
  [K in keyof T & string]: T[K] extends PrimitiveFieldValue
    ? K
    : K | `${K}.${FieldPath<T[K]>}`;
}[keyof T & string];

export const PROFILE_URL_PREFIX = 'profile/';

export const ACCOUNT_TYPE_OPTIONS = [
  { value: AccountTypeEnum.USER, label: 'User' },
  { value: AccountTypeEnum.MODERATOR, label: 'Moderator' },
  { value: AccountTypeEnum.ADMIN, label: 'Admin' },
] as const;

export type SignUpFormFieldPath = FieldPath<SignUpForm>;

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
