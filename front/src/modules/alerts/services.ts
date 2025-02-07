// ** Redux Imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axiosInstance from "@configs/axios";

// ** Types & Interfaces
import { IRedux } from "@modules/shared/interfaces";
import { IManageUserAlertSetting } from "@modules/alerts/interfaces";

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
    async (_, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/alerts/user-settings/",
          method: "GET",
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** createUserAlertSetting
  static createUserAlertSetting = createAsyncThunk(
    "AlertService/createUserAlertSetting",
    async (payload: IManageUserAlertSetting[], redux: IRedux) => {
      console.log("payload: ", payload);
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

  // ** updateOrDeleteUserAlertSetting
  static updateOrDeleteUserAlertSetting = createAsyncThunk(
    "AlertService/updateOrDeleteUserAlertSetting",
    async (payload: IManageUserAlertSetting, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: "/api/alerts/user-settings/manage/",
          method: "PUT",
          data: payload,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );
}
