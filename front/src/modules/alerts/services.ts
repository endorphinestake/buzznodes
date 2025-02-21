// ** Redux Imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axiosInstance from "@configs/axios";

// ** Types & Interfaces
import { IRedux } from "@modules/shared/interfaces";
import {
  IManageUserAlertSetting,
  IUserAlertSettingsFilter,
} from "@modules/alerts/interfaces";

export class AlertService {
  // ** fetchAlertSettings
  static fetchAlertSettings = createAsyncThunk(
    "AlertService/fetchAlertSettings",
    async (_, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/alerts/settings/",
          method: "GET",
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** fetchUserAlertSettings
  static fetchUserAlertSettings = createAsyncThunk(
    "AlertService/fetchUserAlertSettings",
    async (params: IUserAlertSettingsFilter, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: `/api/alerts/user-settings/${params.blockchainId}/`,
          method: "GET",
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** manageUserAlertSetting
  static manageUserAlertSetting = createAsyncThunk(
    "AlertService/manageUserAlertSetting",
    async (payload: IManageUserAlertSetting[], redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/alerts/user-settings/manage/",
          method: "POST",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );
}
