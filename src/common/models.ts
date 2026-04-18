import { Address } from '../components/address-form/address-form.model';

export enum AccountTypeEnum {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
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
