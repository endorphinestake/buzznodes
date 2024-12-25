// ** Redux Imports
import { createSlice, SerializedError } from "@reduxjs/toolkit";

// ** Import Services
import { UserService } from "@modules/users/services";

// ** Types & Interfaces
import { TUser } from "@modules/users/types";

export type TUserServiceState = {
  login: Function;
  register: Function;
  registerConfirm: Function;
  loginGoogle: Function;
  logout: Function;
  resetPassword: Function;
  resetPasswordConfirm: Function;
  getProfile: Function;
  profileUpdate: Function;
  passwordChange: Function;
  emailChange: Function;
  emailChangeConfirm: Function;

  isLoginLoading: boolean;
  isLoginLoaded: boolean;
  isLoginError: any;

  isRegisterLoading: boolean;
  isRegisterLoaded: boolean;
  isRegisterError: any;

  isRegisterConfirmLoading: boolean;
  isRegisterConfirmLoaded: boolean;
  isRegisterConfirmError: any;

  isLoginGoogleLoading: boolean;
  isLoginGoogleLoaded: boolean;
  isLoginGoogleError: any;

  isLogoutLoading: boolean;
  isLogoutLoaded: boolean;
  isLogoutError: any;

  isResetPasswordLoading: boolean;
  isResetPasswordLoaded: boolean;
  isResetPasswordError: any;

  isResetPasswordConfirmLoading: boolean;
  isResetPasswordConfirmLoaded: boolean;
  isResetPasswordConfirmError: any;

  isProfileLoading: boolean;
  isProfileLoaded: boolean;
  isProfileError: any;
  profile: null | TUser;

  isProfileUpdateLoading: boolean;
  isProfileUpdateLoaded: boolean;
  isProfileUpdateError: any;

  isPasswordChangeLoading: boolean;
  isPasswordChangeLoaded: boolean;
  isPasswordChangeError: any;

  isEmailChangeLoading: boolean;
  isEmailChangeLoaded: boolean;
  isEmailChangeError: any;

  isEmailChangeConfirmLoading: boolean;
  isEmailChangeConfirmLoaded: boolean;
  isEmailChangeConfirmError: any;
};

const initialState: TUserServiceState = {
  login: UserService.login,
  register: UserService.register,
  registerConfirm: UserService.registerConfirm,
  loginGoogle: UserService.loginGoogle,
  logout: UserService.logout,
  resetPassword: UserService.resetPassword,
  resetPasswordConfirm: UserService.resetPasswordConfirm,
  getProfile: UserService.getProfile,
  profileUpdate: UserService.profileUpdate,
  passwordChange: UserService.passwordChange,
  emailChange: UserService.emailChange,
  emailChangeConfirm: UserService.emailChangeConfirm,

  isLoginLoading: false,
  isLoginLoaded: false,
  isLoginError: null,

  isRegisterLoading: false,
  isRegisterLoaded: false,
  isRegisterError: null,

  isRegisterConfirmLoading: false,
  isRegisterConfirmLoaded: false,
  isRegisterConfirmError: null,

  isLoginGoogleLoading: false,
  isLoginGoogleLoaded: false,
  isLoginGoogleError: null,

  isLogoutLoading: false,
  isLogoutLoaded: false,
  isLogoutError: null,

  isResetPasswordLoading: false,
  isResetPasswordLoaded: false,
  isResetPasswordError: null,

  isResetPasswordConfirmLoading: false,
  isResetPasswordConfirmLoaded: false,
  isResetPasswordConfirmError: null,

  isProfileLoading: false,
  isProfileLoaded: false,
  isProfileError: null,
  profile: null,

  isProfileUpdateLoading: false,
  isProfileUpdateLoaded: false,
  isProfileUpdateError: null,

  isPasswordChangeLoading: false,
  isPasswordChangeLoaded: false,
  isPasswordChangeError: null,

  isEmailChangeLoading: false,
  isEmailChangeLoaded: false,
  isEmailChangeError: null,

  isEmailChangeConfirmLoading: false,
  isEmailChangeConfirmLoaded: false,
  isEmailChangeConfirmError: null,
};

export const UserSlice = createSlice({
  name: "UserService",
  initialState,
  reducers: {
    resetLoginState(state) {
      state.isLoginLoaded = false;
      state.isLoginError = null;
    },
    resetRegisterState(state) {
      state.isRegisterLoaded = false;
      state.isRegisterError = null;
    },
    resetRegisterConfirmState(state) {
      state.isRegisterConfirmLoaded = false;
      state.isRegisterConfirmError = null;
    },
    resetLoginGoogleState(state) {
      state.isLoginGoogleLoaded = false;
      state.isLoginGoogleError = null;
    },
    resetResetPasswordState(state) {
      state.isResetPasswordLoaded = false;
      state.isResetPasswordError = null;
    },
    resetResetPasswordConfirmState(state) {
      state.isResetPasswordConfirmLoaded = false;
      state.isResetPasswordConfirmError = null;
    },
    resetProfileLoadingState(state) {
      state.isProfileLoaded = false;
      state.isProfileError = null;
    },
    resetProfileUpdateState(state) {
      state.isProfileUpdateLoaded = false;
      state.isProfileUpdateError = null;
    },
    resetPasswordChangeState(state) {
      state.isPasswordChangeLoaded = false;
      state.isPasswordChangeError = null;
    },
    resetEmailChangeState(state) {
      state.isEmailChangeLoaded = false;
      state.isEmailChangeError = null;
    },
    resetEmailChangeConfirmState(state) {
      state.isEmailChangeConfirmLoaded = false;
      state.isEmailChangeConfirmError = null;
    },
  },
  extraReducers: (builder) => {
    // ** LoginView
    builder.addCase(UserService.login.pending, (state, action) => {
      state.isLoginLoading = true;
      state.isLoginLoaded = false;
      state.isLoginError = null;
    });
    builder.addCase(UserService.login.fulfilled, (state, action) => {
      state.isLoginLoading = false;
      state.isLoginLoaded = true;
    });
    builder.addCase(UserService.login.rejected, (state, action) => {
      state.isLoginLoading = false;
      state.isLoginError = action.payload;
    });

    // ** RegisterView
    builder.addCase(UserService.register.pending, (state, action) => {
      state.isRegisterLoading = true;
      state.isRegisterLoaded = false;
      state.isRegisterError = null;
    });
    builder.addCase(UserService.register.fulfilled, (state, action) => {
      state.isRegisterLoading = false;
      state.isRegisterLoaded = true;
    });
    builder.addCase(UserService.register.rejected, (state, action) => {
      state.isRegisterLoading = false;
      state.isRegisterError = action.payload;
    });

    // ** RegisterConfirmView
    builder.addCase(UserService.registerConfirm.pending, (state, action) => {
      state.isRegisterConfirmLoading = true;
      state.isRegisterConfirmLoaded = false;
      state.isRegisterConfirmError = null;
    });
    builder.addCase(UserService.registerConfirm.fulfilled, (state, action) => {
      state.isRegisterConfirmLoading = false;
      state.isRegisterConfirmLoaded = true;
    });
    builder.addCase(UserService.registerConfirm.rejected, (state, action) => {
      state.isRegisterConfirmLoading = false;
      state.isRegisterConfirmError = action.payload;
    });

    // ** LoginGoogleView
    builder.addCase(UserService.loginGoogle.pending, (state, action) => {
      state.isLoginGoogleLoading = true;
      state.isLoginGoogleLoaded = false;
      state.isLoginGoogleError = null;
    });
    builder.addCase(UserService.loginGoogle.fulfilled, (state, action) => {
      state.isLoginGoogleLoading = false;
      state.isLoginGoogleLoaded = true;
    });
    builder.addCase(UserService.loginGoogle.rejected, (state, action) => {
      state.isLoginGoogleLoading = false;
      state.isLoginGoogleError = action.payload;
    });

    // ** LogoutView
    builder.addCase(UserService.logout.pending, (state, action) => {
      state.isLogoutLoading = true;
      state.isLogoutLoaded = false;
      state.isLogoutError = null;
    });
    builder.addCase(UserService.logout.fulfilled, (state, action) => {
      state.isLogoutLoading = false;
      state.isLogoutLoaded = true;
    });
    builder.addCase(UserService.logout.rejected, (state, action) => {
      state.isLogoutLoading = false;
      state.isLogoutError = action.payload;
    });

    // ** ResetPasswordView
    builder.addCase(UserService.resetPassword.pending, (state, action) => {
      state.isResetPasswordLoading = true;
      state.isResetPasswordLoaded = false;
      state.isResetPasswordError = null;
    });
    builder.addCase(UserService.resetPassword.fulfilled, (state, action) => {
      state.isResetPasswordLoading = false;
      state.isResetPasswordLoaded = true;
    });
    builder.addCase(UserService.resetPassword.rejected, (state, action) => {
      state.isResetPasswordLoading = false;
      state.isResetPasswordError = action.payload;
    });

    // ** ResetPasswordConfirmView
    builder.addCase(
      UserService.resetPasswordConfirm.pending,
      (state, action) => {
        state.isResetPasswordConfirmLoading = true;
        state.isResetPasswordConfirmLoaded = false;
        state.isResetPasswordConfirmError = null;
      }
    );
    builder.addCase(
      UserService.resetPasswordConfirm.fulfilled,
      (state, action) => {
        state.isResetPasswordConfirmLoading = false;
        state.isResetPasswordConfirmLoaded = true;
      }
    );
    builder.addCase(
      UserService.resetPasswordConfirm.rejected,
      (state, action) => {
        state.isResetPasswordConfirmLoading = false;
        state.isResetPasswordConfirmError = action.payload;
      }
    );

    // ** ProfileView
    builder.addCase(UserService.getProfile.pending, (state, action) => {
      state.isProfileLoading = true;
      state.isProfileLoaded = false;
      state.isProfileError = null;
    });
    builder.addCase(UserService.getProfile.fulfilled, (state, action) => {
      state.isProfileLoading = false;
      state.isProfileLoaded = true;
      state.profile = action.payload;
    });
    builder.addCase(UserService.getProfile.rejected, (state, action) => {
      state.isProfileLoading = false;
      state.isProfileError = action.payload;
    });

    // ** ProfileUpdateView
    builder.addCase(UserService.profileUpdate.pending, (state, action) => {
      state.isProfileUpdateLoading = true;
      state.isProfileUpdateLoaded = false;
      state.isProfileUpdateError = null;
    });
    builder.addCase(UserService.profileUpdate.fulfilled, (state, action) => {
      state.isProfileUpdateLoading = false;
      state.isProfileUpdateLoaded = true;
    });
    builder.addCase(UserService.profileUpdate.rejected, (state, action) => {
      state.isProfileUpdateLoading = false;
      state.isProfileUpdateError = action.payload;
    });

    // ** PasswordChangeView
    builder.addCase(UserService.passwordChange.pending, (state, action) => {
      state.isPasswordChangeLoading = true;
      state.isPasswordChangeLoaded = false;
      state.isPasswordChangeError = null;
    });
    builder.addCase(UserService.passwordChange.fulfilled, (state, action) => {
      state.isPasswordChangeLoading = false;
      state.isPasswordChangeLoaded = true;
    });
    builder.addCase(UserService.passwordChange.rejected, (state, action) => {
      state.isPasswordChangeLoading = false;
      state.isPasswordChangeError = action.payload;
    });

    // ** EmailChangeView
    builder.addCase(UserService.emailChange.pending, (state, action) => {
      state.isEmailChangeLoading = true;
      state.isEmailChangeLoaded = false;
      state.isEmailChangeError = null;
    });
    builder.addCase(UserService.emailChange.fulfilled, (state, action) => {
      state.isEmailChangeLoading = false;
      state.isEmailChangeLoaded = true;
    });
    builder.addCase(UserService.emailChange.rejected, (state, action) => {
      state.isEmailChangeLoading = false;
      state.isEmailChangeError = action.payload;
    });

    // ** EmailChangeConfirmView
    builder.addCase(UserService.emailChangeConfirm.pending, (state, action) => {
      state.isEmailChangeConfirmLoading = true;
      state.isEmailChangeConfirmLoaded = false;
      state.isEmailChangeConfirmError = null;
    });
    builder.addCase(
      UserService.emailChangeConfirm.fulfilled,
      (state, action) => {
        state.isEmailChangeConfirmLoading = false;
        state.isEmailChangeConfirmLoaded = true;
      }
    );
    builder.addCase(
      UserService.emailChangeConfirm.rejected,
      (state, action) => {
        state.isEmailChangeConfirmLoading = false;
        state.isEmailChangeConfirmError = action.payload;
      }
    );
  },
});

export const actions = UserSlice.actions;
export default UserSlice.reducer;
