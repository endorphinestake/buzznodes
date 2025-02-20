// ** Redux Imports
import { createSlice, SerializedError } from "@reduxjs/toolkit";

// ** Import Services
import { BlockchainService } from "@modules/blockchains/services";

// ** Types & Interfaces
import {
  TBlockchainValidators,
  TBlockchainValidatorDetail,
  TBlockchainBridges,
  TValidatorChart,
} from "@modules/blockchains/types";
import { EValidatorChartPeriod } from "@modules/blockchains/enums";

export type TBlockchainValidatorState = {
  fetchBlockchainValidators: Function;
  fetchBlockchainValidatorDetail: Function;
  fetchBlockchainBridges: Function;
  fetchValidatorCharts: Function;

  isBlockchainValidatorsLoading: boolean;
  isBlockchainValidatorsLoaded: boolean;
  isBlockchainValidatorsError: any;
  blockchainValidators: TBlockchainValidators;

  isBlockchainValidatorDetailLoading: boolean;
  isBlockchainValidatorDetailLoaded: boolean;
  isBlockchainValidatorDetailError: any;
  blockchainValidator?: TBlockchainValidatorDetail;

  isBlockchainBridgesLoading: boolean;
  isBlockchainBridgesLoaded: boolean;
  isBlockchainBridgesError: any;
  blockchainBridges: TBlockchainBridges;

  isValidatorChartsLoading: boolean;
  isValidatorChartsLoaded: boolean;
  isValidatorChartsError: any;
  validatorCharts: TValidatorChart;

  period: EValidatorChartPeriod;
};

const initialState: TBlockchainValidatorState = {
  fetchBlockchainValidators: BlockchainService.fetchBlockchainValidators,
  fetchValidatorCharts: BlockchainService.fetchValidatorCharts,
  fetchBlockchainValidatorDetail:
    BlockchainService.fetchBlockchainValidatorDetail,
  fetchBlockchainBridges: BlockchainService.fetchBlockchainBridges,

  isBlockchainValidatorsLoading: false,
  isBlockchainValidatorsLoaded: false,
  isBlockchainValidatorsError: null,
  blockchainValidators: {
    network_height: 0,
    validators: [],
  } as TBlockchainValidators,

  isBlockchainValidatorDetailLoading: false,
  isBlockchainValidatorDetailLoaded: false,
  isBlockchainValidatorDetailError: null,
  blockchainValidator: undefined,

  isBlockchainBridgesLoading: false,
  isBlockchainBridgesLoaded: false,
  isBlockchainBridgesError: null,
  blockchainBridges: { bridges: [], network_height: 0 } as TBlockchainBridges,

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
    resetBlockchainValidatorDetailState(state) {
      state.isBlockchainValidatorDetailLoading = false;
      state.isBlockchainValidatorDetailError = null;
    },
    resetBlockchainBridgesState(state) {
      state.isBlockchainBridgesLoading = false;
      state.isBlockchainBridgesError = null;
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
        state.blockchainValidators = {
          network_height: 0,
          validators: [],
        } as TBlockchainValidators;
      }
    );

    // ** fetchBlockchainValidatorDetail
    builder.addCase(
      BlockchainService.fetchBlockchainValidatorDetail.pending,
      (state, action) => {
        state.isBlockchainValidatorDetailLoading = true;
        state.isBlockchainValidatorDetailLoaded = false;
        state.isBlockchainValidatorDetailError = null;
      }
    );
    builder.addCase(
      BlockchainService.fetchBlockchainValidatorDetail.fulfilled,
      (state, action) => {
        state.isBlockchainValidatorDetailLoading = false;
        state.isBlockchainValidatorDetailLoaded = true;
        state.blockchainValidator = action.payload;
      }
    );
    builder.addCase(
      BlockchainService.fetchBlockchainValidatorDetail.rejected,
      (state, action) => {
        state.isBlockchainValidatorDetailLoading = false;
        state.isBlockchainValidatorDetailError = action.payload;
        state.blockchainValidator = undefined;
      }
    );

    // ** fetchBlockchainBridges
    builder.addCase(
      BlockchainService.fetchBlockchainBridges.pending,
      (state, action) => {
        state.isBlockchainBridgesLoading = true;
        state.isBlockchainBridgesLoaded = false;
        state.isBlockchainBridgesError = null;
      }
    );
    builder.addCase(
      BlockchainService.fetchBlockchainBridges.fulfilled,
      (state, action) => {
        state.isBlockchainBridgesLoading = false;
        state.isBlockchainBridgesLoaded = true;
        state.blockchainBridges = action.payload;
      }
    );
    builder.addCase(
      BlockchainService.fetchBlockchainBridges.rejected,
      (state, action) => {
        state.isBlockchainBridgesLoading = false;
        state.isBlockchainBridgesError = action.payload;
        state.blockchainBridges = {
          bridges: [],
          network_height: 0,
        } as TBlockchainBridges;
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
