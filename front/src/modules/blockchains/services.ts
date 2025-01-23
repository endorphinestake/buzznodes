// ** Redux Imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axiosInstance from "@configs/axios";

// ** Types & Interfaces
import { IRedux } from "@modules/shared/interfaces";
import {
  IBlockchainValidatorsFilter,
  IValidatorChartsFilter,
} from "@modules/blockchains/interfaces";

export class BlockchainService {
  // ** fetchBlockchainValidators
  static fetchBlockchainValidators = createAsyncThunk(
    "BlockchainService/fetchBlockchainValidators",
    async (params: IBlockchainValidatorsFilter, redux: IRedux) => {
      try {
        const { data } = await axiosInstance({
          url: `/api/blockchains/list/`,
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
        });

        return data;
      } catch (error) {
        return redux.rejectWithValue(error);
      }
    }
  );
}
