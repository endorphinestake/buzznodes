// ** Redux Imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axiosInstance from "@configs/axios";

// ** Types & Interfaces
import { IRedux } from "@modules/shared/interfaces";
import {
  ILoginSerializer,
  IRegisterSerializer,
  IRegisterConfirmSerializer,
  ILoginGoogleSerializer,
  IResetPasswordSerializer,
  IResetPasswordConfirmSerializer,
  IChangeEmailSerializer,
  IChangeEmailConfirmSerializer,
  IChangePasswordSerializer,
  IUpdateUserSerializer,
  IUserPhoneCreate,
  IUserPhoneID,
  IConfirmUserPhone,
} from "@modules/users/interfaces";

export class UserService {
  // ** LoginView
  static login = createAsyncThunk(
    "UserService/login",
    async (payload: ILoginSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/login/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** RegisterView
  static register = createAsyncThunk(
    "UserService/register",
    async (payload: IRegisterSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/register/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** RegisterConfirmView
  static registerConfirm = createAsyncThunk(
    "UserService/registerConfirm",
    async (payload: IRegisterConfirmSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/register/confirm/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** LoginGoogleView
  static loginGoogle = createAsyncThunk(
    "UserService/loginGoogle",
    async (payload: ILoginGoogleSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/login/google/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** LogoutView
  static logout = createAsyncThunk(
    "UserService/logout",
    async (_, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/logout/",
          method: "POST",
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** ResetPasswordView
  static resetPassword = createAsyncThunk(
    "UserService/resetPassword",
    async (payload: IResetPasswordSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/reset-password/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** ResetPasswordConfirmView
  static resetPasswordConfirm = createAsyncThunk(
    "UserService/resetPasswordConfirm",
    async (payload: IResetPasswordConfirmSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/reset-password/confirm/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** ProfileView
  static getProfile = createAsyncThunk(
    "UserService/profile",
    async (_, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/profile/",
          method: "GET",
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** ProfileUpdateView
  static profileUpdate = createAsyncThunk(
    "UserService/profileUpdate",
    async (payload: IUpdateUserSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/profile/",
          method: "PUT",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** PasswordChangeView
  static passwordChange = createAsyncThunk(
    "UserService/passwordChange",
    async (payload: IChangePasswordSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/password-change/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** EmailChangeView
  static emailChange = createAsyncThunk(
    "UserService/emailChange",
    async (payload: IChangeEmailSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/email-change/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** EmailChangeConfirmView
  static emailChangeConfirm = createAsyncThunk(
    "UserService/emailChangeConfirm",
    async (payload: IChangeEmailConfirmSerializer, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/email-change/confirm/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** CreateUserPhoneView
  static createUserPhone = createAsyncThunk(
    "UserService/createUserPhone",
    async (payload: IUserPhoneCreate, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/phone/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** DeleteUserPhoneView
  static deleteUserPhone = createAsyncThunk(
    "UserService/deleteUserPhone",
    async (payload: IUserPhoneID, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/phone/",
          method: "DELETE",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** ResendUserPhoneConfirm
  static resendUserPhoneConfirm = createAsyncThunk(
    "UserService/resendUserPhoneConfirm",
    async (payload: IUserPhoneID, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: `/api/users/phone/resend/${payload.user_phone_id}/`,
          method: "POST",
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** ConfirmUserPhoneView
  static confirmUserPhone = createAsyncThunk(
    "UserService/confirmUserPhone",
    async (payload: IConfirmUserPhone, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/users/phone/confirm/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** UserPhoneTestVoice
  static testingUserPhoneVoice = createAsyncThunk(
    "UserService/testingUserPhoneVoice",
    async (payload: IUserPhoneID, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: `/api/users/phone/test-voice/${payload.user_phone_id}/`,
          method: "POST",
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );
}
