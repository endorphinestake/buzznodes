// ** Redux Imports
import { createSlice, SerializedError } from "@reduxjs/toolkit";

// ** Import Services
import { BlockchainService } from "@modules/blockchains/services";

// ** Types & Interfaces
import { TBlockchainValidator } from "@modules/blockchains/types";

export type TBlockchainValidatorState = {
  getBlockchainValidators: Function;

  isBlockchainValidatorsLoading: boolean;
  isBlockchainValidatorsLoaded: boolean;
  isBlockchainValidatorsError: any;
  blockchainValidators: TBlockchainValidator[];
};

const initialState: TBlockchainValidatorState = {
  getBlockchainValidators: BlockchainService.getBlockchainValidators,

  isBlockchainValidatorsLoading: false,
  isBlockchainValidatorsLoaded: false,
  isBlockchainValidatorsError: null,
  blockchainValidators: [],
};

export const BlockchainValidatorSlice = createSlice({
  name: "BlockchainValidatorSlice",
  initialState,
  reducers: {
    resetBlockchainValidatorsState(state) {
      state.isBlockchainValidatorsLoading = false;
      state.isBlockchainValidatorsError = null;
    },
  },
  extraReducers: (builder) => {
    // ** getBlockchainValidators
    builder.addCase(
      BlockchainService.getBlockchainValidators.pending,
      (state, action) => {
        state.isBlockchainValidatorsLoading = true;
        state.isBlockchainValidatorsLoaded = false;
        state.isBlockchainValidatorsError = null;
      }
    );
    builder.addCase(
      BlockchainService.getBlockchainValidators.fulfilled,
      (state, action) => {
        state.isBlockchainValidatorsLoading = false;
        state.isBlockchainValidatorsLoaded = true;
        state.blockchainValidators = action.payload;
      }
    );
    builder.addCase(
      BlockchainService.getBlockchainValidators.rejected,
      (state, action) => {
        state.isBlockchainValidatorsLoading = false;
        state.isBlockchainValidatorsError = action.payload;
        state.blockchainValidators = [];
      }
    );
  },
});

export const actions = BlockchainValidatorSlice.actions;
export default BlockchainValidatorSlice.reducer;
