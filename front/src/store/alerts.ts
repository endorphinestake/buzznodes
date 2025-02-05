// ** Redux Imports
import { createSlice, SerializedError } from "@reduxjs/toolkit";

// ** Import Services
import { AlertService } from "@modules/alerts/services";

// ** Types & Interfaces & Enums
import {
  TAlertSettingsResponse,
  TUserAlertSettingsResponse,
} from "@modules/alerts/types";

export type TAlertState = {
  fetchAlertSettings: Function;
  fetchUserAlertSettings: Function;
  createUserAlertSetting: Function;
  updateOrDeleteUserAlertSetting: Function;

  isAlertSettingsLoading: boolean;
  isAlertSettingsLoaded: boolean;
  isAlertSettingsError: any;
  alertSettings: TAlertSettingsResponse;

  isUserAlertSettingsLoading: boolean;
  isUserAlertSettingsLoaded: boolean;
  isUserAlertSettingsError: any;
  userAlertSettings: TUserAlertSettingsResponse;

  isCreatingUserAlertSettingLoading: boolean;
  isCreatingUserAlertSettingLoaded: boolean;
  isCreatingUserAlertSettingError: any;

  isUpdatingOrDeletingUserAlertSettingLoading: boolean;
  isUpdatingOrDeletingUserAlertSettingLoaded: boolean;
  isUpdatingOrDeletingUserAlertSettingError: any;
};

const initialState: TAlertState = {
  fetchAlertSettings: AlertService.fetchAlertSettings,
  fetchUserAlertSettings: AlertService.fetchUserAlertSettings,
  createUserAlertSetting: AlertService.createUserAlertSetting,
  updateOrDeleteUserAlertSetting: AlertService.updateOrDeleteUserAlertSetting,

  isAlertSettingsLoading: false,
  isAlertSettingsLoaded: false,
  isAlertSettingsError: null,
  alertSettings: {} as TAlertSettingsResponse,

  isUserAlertSettingsLoading: false,
  isUserAlertSettingsLoaded: false,
  isUserAlertSettingsError: null,
  userAlertSettings: {} as TUserAlertSettingsResponse,

  isCreatingUserAlertSettingLoading: false,
  isCreatingUserAlertSettingLoaded: false,
  isCreatingUserAlertSettingError: null,

  isUpdatingOrDeletingUserAlertSettingLoading: false,
  isUpdatingOrDeletingUserAlertSettingLoaded: false,
  isUpdatingOrDeletingUserAlertSettingError: null,
};

export const AlertSlice = createSlice({
  name: "AlertSlice",
  initialState,
  reducers: {
    resetAlertSettingsState(state) {
      state.isAlertSettingsLoaded = false;
      state.isAlertSettingsError = null;
    },
    resetUserAlertSettingsState(state) {
      state.isUserAlertSettingsLoaded = false;
      state.isUserAlertSettingsError = null;
    },
    resetCreateUserAlertSettingState(state) {
      state.isCreatingUserAlertSettingLoaded = false;
      state.isCreatingUserAlertSettingError = null;
    },
    resetUpdateOrDeleteUserAlertSettingState(state) {
      state.isUpdatingOrDeletingUserAlertSettingLoaded = false;
      state.isUpdatingOrDeletingUserAlertSettingError = null;
    },
  },
  extraReducers: (builder) => {
    // ** fetchAlertSettings
    builder.addCase(
      AlertService.fetchAlertSettings.pending,
      (state, action) => {
        state.isAlertSettingsLoading = true;
        state.isAlertSettingsLoaded = false;
        state.isAlertSettingsError = null;
      }
    );
    builder.addCase(
      AlertService.fetchAlertSettings.fulfilled,
      (state, action) => {
        state.isAlertSettingsLoading = false;
        state.isAlertSettingsLoaded = true;
        state.alertSettings = action.payload;
      }
    );
    builder.addCase(
      AlertService.fetchAlertSettings.rejected,
      (state, action) => {
        state.isAlertSettingsLoading = false;
        state.isAlertSettingsError = action.payload;
        state.alertSettings = {} as TAlertSettingsResponse;
      }
    );

    // ** fetchUserAlertSettings
    builder.addCase(
      AlertService.fetchUserAlertSettings.pending,
      (state, action) => {
        state.isUserAlertSettingsLoading = true;
        state.isUserAlertSettingsLoaded = false;
        state.isUserAlertSettingsError = null;
      }
    );
    builder.addCase(
      AlertService.fetchUserAlertSettings.fulfilled,
      (state, action) => {
        state.isUserAlertSettingsLoading = false;
        state.isUserAlertSettingsLoaded = true;
        state.userAlertSettings = action.payload;
      }
    );
    builder.addCase(
      AlertService.fetchUserAlertSettings.rejected,
      (state, action) => {
        state.isUserAlertSettingsLoading = false;
        state.isUserAlertSettingsError = action.payload;
        state.userAlertSettings = {} as TUserAlertSettingsResponse;
      }
    );

    // ** createUserAlertSetting
    builder.addCase(
      AlertService.createUserAlertSetting.pending,
      (state, action) => {
        state.isCreatingUserAlertSettingLoading = true;
        state.isCreatingUserAlertSettingLoaded = false;
        state.isCreatingUserAlertSettingError = null;
      }
    );
    builder.addCase(
      AlertService.createUserAlertSetting.fulfilled,
      (state, action) => {
        state.isCreatingUserAlertSettingLoading = false;
        state.isCreatingUserAlertSettingLoaded = true;
      }
    );
    builder.addCase(
      AlertService.createUserAlertSetting.rejected,
      (state, action) => {
        state.isCreatingUserAlertSettingLoading = false;
        state.isCreatingUserAlertSettingError = action.payload;
      }
    );

    // ** updateOrDeleteUserAlertSetting
    builder.addCase(
      AlertService.updateOrDeleteUserAlertSetting.pending,
      (state, action) => {
        state.isUpdatingOrDeletingUserAlertSettingLoading = true;
        state.isUpdatingOrDeletingUserAlertSettingLoaded = false;
        state.isUpdatingOrDeletingUserAlertSettingError = null;
      }
    );
    builder.addCase(
      AlertService.updateOrDeleteUserAlertSetting.fulfilled,
      (state, action) => {
        state.isUpdatingOrDeletingUserAlertSettingLoading = false;
        state.isUpdatingOrDeletingUserAlertSettingLoaded = true;
      }
    );
    builder.addCase(
      AlertService.updateOrDeleteUserAlertSetting.rejected,
      (state, action) => {
        state.isUpdatingOrDeletingUserAlertSettingLoading = false;
        state.isUpdatingOrDeletingUserAlertSettingError = action.payload;
      }
    );
  },
});

export const actions = AlertSlice.actions;
export default AlertSlice.reducer;
