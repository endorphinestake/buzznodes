// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { TDispatch, TRootState } from 'src/store';
import { TUserServiceState, actions } from 'src/store/users';

export const useUserService = () => {
  const dispatch = useDispatch<TDispatch>();
  const { ...state } = useSelector<TRootState, TUserServiceState>(
    (state) => state.UserService
  );

  return {
    dispatch,
    ...state,
    ...actions,
  };
};
