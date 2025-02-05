// ** Redux Imports
import { useDispatch, useSelector } from "react-redux";
import { TDispatch, TRootState } from "src/store";
import { TAlertState, actions } from "src/store/alerts";

export const useAlertService = () => {
  const dispatch = useDispatch<TDispatch>();
  const { ...state } = useSelector<TRootState, TAlertState>(
    (state) => state.AlertService
  );

  return {
    dispatch,
    ...state,
    ...actions,
  };
};
