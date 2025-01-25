// ** Redux Imports
import { createSlice, SerializedError } from "@reduxjs/toolkit";

// ** Import Services
import { BlockchainService } from "@modules/blockchains/services";

// ** Types & Interfaces
import {
  TBlockchainValidator,
  TValidatorChart,
} from "@modules/blockchains/types";
import { EValidatorChartPeriod } from "@modules/blockchains/enums";

export type TBlockchainValidatorState = {
  fetchBlockchainValidators: Function;
  fetchValidatorCharts: Function;

  isBlockchainValidatorsLoading: boolean;
  isBlockchainValidatorsLoaded: boolean;
  isBlockchainValidatorsError: any;
  blockchainValidators: TBlockchainValidator[];

  isValidatorChartsLoading: boolean;
  isValidatorChartsLoaded: boolean;
  isValidatorChartsError: any;
  validatorCharts: TValidatorChart;

  period: EValidatorChartPeriod;
};

const initialState: TBlockchainValidatorState = {
  fetchBlockchainValidators: BlockchainService.fetchBlockchainValidators,
  fetchValidatorCharts: BlockchainService.fetchValidatorCharts,

  isBlockchainValidatorsLoading: false,
  isBlockchainValidatorsLoaded: false,
  isBlockchainValidatorsError: null,
  blockchainValidators: [],

  isValidatorChartsLoading: false,
  isValidatorChartsLoaded: false,
  isValidatorChartsError: null,
  validatorCharts: {} as TValidatorChart,

  period: EValidatorChartPeriod.H24,
};

export const BlockchainValidatorSlice = createSlice({
  name: "BlockchainValidatorSlice",
  initialState,
  reducers: {
    resetBlockchainValidatorsState(state) {
      state.isBlockchainValidatorsLoading = false;
      state.isBlockchainValidatorsError = null;
    },
    resetValidatorChartsState(state) {
      state.isValidatorChartsLoading = false;
      state.isValidatorChartsError = null;
    },
    setPeriod(state, action) {
      state.period = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ** fetchBlockchainValidators
    builder.addCase(
      BlockchainService.fetchBlockchainValidators.pending,
      (state, action) => {
        state.isBlockchainValidatorsLoading = true;
        state.isBlockchainValidatorsLoaded = false;
        state.isBlockchainValidatorsError = null;
      }
    );
    builder.addCase(
      BlockchainService.fetchBlockchainValidators.fulfilled,
      (state, action) => {
        state.isBlockchainValidatorsLoading = false;
        state.isBlockchainValidatorsLoaded = true;
        state.blockchainValidators = action.payload;
      }
    );
    builder.addCase(
      BlockchainService.fetchBlockchainValidators.rejected,
      (state, action) => {
        state.isBlockchainValidatorsLoading = false;
        state.isBlockchainValidatorsError = action.payload;
        state.blockchainValidators = [];
      }
    );

    // ** fetchValidatorCharts
    builder.addCase(
      BlockchainService.fetchValidatorCharts.pending,
      (state, action) => {
        state.isValidatorChartsLoading = true;
        state.isValidatorChartsLoaded = false;
        state.isValidatorChartsError = null;
      }
    );
    builder.addCase(
      BlockchainService.fetchValidatorCharts.fulfilled,
      (state, action) => {
        state.isValidatorChartsLoading = false;
        state.isValidatorChartsLoaded = true;
        state.validatorCharts = action.payload;
      }
    );
    builder.addCase(
      BlockchainService.fetchValidatorCharts.rejected,
      (state, action) => {
        state.isValidatorChartsLoading = false;
        state.isValidatorChartsError = action.payload;
        state.validatorCharts = {} as TValidatorChart;
      }
    );
  },
});

export const actions = BlockchainValidatorSlice.actions;
export default BlockchainValidatorSlice.reducer;
