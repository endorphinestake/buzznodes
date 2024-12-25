import { TUser } from "@modules/users/types";

export interface IAuthValues {
  isInitialization: boolean;
  isInitialized: boolean;
  user?: TUser;
  logout: () => void;
}

export interface ILoginSerializer {
  email: string;
  password: string;
}

export interface IRegisterSerializer {
  email: string;
  password: string;
}

export interface IRegisterConfirmSerializer {
  token: string;
}

export interface ILoginGoogleSerializer {
  access_token: string;
  password?: string;
  is_register: boolean;
}

export interface IResetPasswordSerializer {
  email: string;
}

export interface IResetPasswordConfirmSerializer {
  new_password: string;
  confirm_new_password: string;
  token: string;
}

export interface IChangeEmailSerializer {
  new_email: string;
}

export interface IChangeEmailConfirmSerializer {
  token: string;
}

export interface IChangePasswordSerializer {
  new_password: string;
  confirm_new_password: string;
  current_password: string;
}

export interface IUpdateUserSerializer {
  first_name?: string;
  last_name?: string;
}
