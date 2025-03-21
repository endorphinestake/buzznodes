// ** Redux Imports
import { createSlice, SerializedError } from "@reduxjs/toolkit";

// ** Import Services
import { AlertService } from "@modules/alerts/services";

// ** Utils Imports
import { groupByValidatorId } from "@modules/alerts/utils";

// ** Types & Interfaces & Enums
import {
  TAlertSettingsResponse,
  TUserAlertSettingsResponse,
  TAlertHistory,
} from "@modules/alerts/types";

export type TAlertState = {
  fetchAlertSettings: Function;
  fetchUserAlertSettings: Function;
  manageUserAlertSetting: Function;
  fetchAlertHistory: Function;

  isAlertSettingsLoading: boolean;
  isAlertSettingsLoaded: boolean;
  isAlertSettingsError: any;
  alertSettings: TAlertSettingsResponse;

  isUserAlertSettingsLoading: boolean;
  isUserAlertSettingsLoaded: boolean;
  isUserAlertSettingsError: any;
  userAlertSettings: Record<number, Partial<TUserAlertSettingsResponse>>;

  isManageUserAlertSettingLoading: boolean;
  isManageUserAlertSettingLoaded: boolean;
  isManageUserAlertSettingError: any;

  isAlertHistoryLoading: boolean;
  isAlertHistoryLoaded: boolean;
  isAlertHistoryError: any;
  alertHistory: TAlertHistory[];
};

const initialState: TAlertState = {
  fetchAlertSettings: AlertService.fetchAlertSettings,
  fetchUserAlertSettings: AlertService.fetchUserAlertSettings,
  manageUserAlertSetting: AlertService.manageUserAlertSetting,
  fetchAlertHistory: AlertService.fetchAlertHistory,

  isAlertSettingsLoading: false,
  isAlertSettingsLoaded: false,
  isAlertSettingsError: null,
  alertSettings: {} as TAlertSettingsResponse,

  isUserAlertSettingsLoading: false,
  isUserAlertSettingsLoaded: false,
  isUserAlertSettingsError: null,
  userAlertSettings: {} as Record<number, Partial<TUserAlertSettingsResponse>>,

  isManageUserAlertSettingLoading: false,
  isManageUserAlertSettingLoaded: false,
  isManageUserAlertSettingError: null,

  isAlertHistoryLoading: false,
  isAlertHistoryLoaded: false,
  isAlertHistoryError: null,
  alertHistory: [],
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
    resetManageUserAlertSettingState(state) {
      state.isManageUserAlertSettingLoaded = false;
      state.isManageUserAlertSettingError = null;
    },
    resetAlertHistoryState(state) {
      state.isAlertHistoryLoaded = false;
      state.isAlertHistoryError = null;
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
        state.userAlertSettings = groupByValidatorId(action.payload);
      }
    );
    builder.addCase(
      AlertService.fetchUserAlertSettings.rejected,
      (state, action) => {
        state.isUserAlertSettingsLoading = false;
        state.isUserAlertSettingsError = action.payload;
        state.userAlertSettings = {} as Record<
          number,
          Partial<TUserAlertSettingsResponse>
        >;
      }
    );

    // ** manageUserAlertSetting
    builder.addCase(
      AlertService.manageUserAlertSetting.pending,
      (state, action) => {
        state.isManageUserAlertSettingLoading = true;
        state.isManageUserAlertSettingLoaded = false;
        state.isManageUserAlertSettingError = null;
      }
    );
    builder.addCase(
      AlertService.manageUserAlertSetting.fulfilled,
      (state, action) => {
        state.isManageUserAlertSettingLoading = false;
        state.isManageUserAlertSettingLoaded = true;
      }
    );
    builder.addCase(
      AlertService.manageUserAlertSetting.rejected,
      (state, action) => {
        state.isManageUserAlertSettingLoading = false;
        state.isManageUserAlertSettingError = action.payload;
      }
    );

    // ** fetchAlertHistory
    builder.addCase(AlertService.fetchAlertHistory.pending, (state, action) => {
      state.isAlertHistoryLoading = true;
      state.isAlertHistoryLoaded = false;
      state.isAlertHistoryError = null;
    });
    builder.addCase(
      AlertService.fetchAlertHistory.fulfilled,
      (state, action) => {
        state.isAlertHistoryLoading = false;
        state.isAlertHistoryLoaded = true;
        state.alertHistory = action.payload;
      }
    );
    builder.addCase(
      AlertService.fetchAlertHistory.rejected,
      (state, action) => {
        state.isAlertHistoryLoading = false;
        state.isAlertHistoryError = action.payload;
        state.alertHistory = [];
      }
    );
  },
});

export const actions = AlertSlice.actions;
export default AlertSlice.reducer;
