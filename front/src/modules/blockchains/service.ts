// ** Redux Imports
import { createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axiosInstance from "@configs/axios";

// ** Types & Interfaces
import { IRedux } from "@modules/shared/interfaces";
import { IBlockchainValidatorsFilter } from "@modules/blockchains/interfaces";

export class BlockchainService {
  // ** getBlockchainValidators
  static getBlockchainValidators = createAsyncThunk(
    "BlockchainService/getBlockchainValidators",
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
}
