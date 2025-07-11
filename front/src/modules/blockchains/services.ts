// ** Redux Imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import qs from "qs";
import axiosInstance from "@configs/axios";

// ** Types & Interfaces
import { IRedux } from "@modules/shared/interfaces";
import {
  IBlockchainValidatorsFilter,
  IBlockchainValidatorsDetail,
  IBlockchainBridgesFilter,
  IValidatorChartsFilter,
} from "@modules/blockchains/interfaces";

export class BlockchainService {
  // ** fetchBlockchainValidators
  static fetchBlockchainValidators = createAsyncThunk(
    "BlockchainService/fetchBlockchainValidators",
    async (params: IBlockchainValidatorsFilter, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: `/api/blockchains/list/${params.blockchainId}/`,
          method: "GET",
          params,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** fetchBlockchainValidatorDetail
  static fetchBlockchainValidatorDetail = createAsyncThunk(
    "BlockchainService/fetchBlockchainValidatorDetail",
    async (params: IBlockchainValidatorsDetail, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: `/api/blockchains/details/${params.blockchainId}/${params.validatorId}/`,
          method: "GET",
          params,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** fetchBlockchainBridges
  static fetchBlockchainBridges = createAsyncThunk(
    "BlockchainService/fetchBlockchainBridges",
    async (params: IBlockchainBridgesFilter, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: `/api/blockchains/bridges/${params.blockchainId}/`,
          method: "GET",
          params,
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );

  // ** fetchValidatorCharts
  static fetchValidatorCharts = createAsyncThunk(
    "BlockchainService/fetchValidatorCharts",
    async (params: IValidatorChartsFilter, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: `/api/blockchains/charts/`,
          method: "GET",
          params,
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );
}
