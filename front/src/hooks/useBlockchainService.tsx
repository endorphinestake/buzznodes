// ** Redux Imports
import { useDispatch, useSelector } from "react-redux";
import { TDispatch, TRootState } from "src/store";
import { TBlockchainValidatorState, actions } from "src/store/blockchains";

export const useBlockchainService = () => {
  const dispatch = useDispatch<TDispatch>();
  const { ...state } = useSelector<TRootState, TBlockchainValidatorState>(
    (state) => state.BlockchainService
  );

  return {
    dispatch,
    ...state,
    ...actions,
  };
};
