// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Imports
import { useRouter } from "next/router";

// ** Hooks
import { useUserService } from "@hooks/useUserService";

// ** Types & Interfaces & Enums
import { TUser } from "@modules/users/types";
import { IAuthValues } from "@modules/users/interfaces";

// ** Defaults
const defaultProvider: IAuthValues = {
  isInitialization: true,
  isInitialized: false,
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

interface IProps {
  children: ReactNode;
}

const AuthProvider = (props: IProps) => {
  const { children } = props;

  // ** States
  const [isInit, setIsInit] = useState<boolean>(false);
  const [user, setUser] = useState<TUser | undefined>(defaultProvider.user);
  const [isInitialization, setIsInitialization] = useState<boolean>(
    defaultProvider.isInitialization
  );
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultProvider.isInitialized
  );

  // ** Hooks
  const router = useRouter();
  const {
    dispatch,
    getProfile,
    logout,
    isLoginLoaded,
    isLoginGoogleLoaded,
    profile,
    isProfileLoaded,
    isProfileError,
    resetProfileLoadingState,
  } = useUserService();

  // Events on Init
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);

      dispatch(getProfile());
    }
  }, [dispatch]);

  // Events on UserService.profile
  useEffect(() => {
    if (isProfileError) {
      setIsInitialization(false);
      setIsInitialized(true);
      setUser(undefined);
    } else if (profile && isProfileLoaded) {
      setIsInitialization(false);
      setIsInitialized(true);
      setUser(profile);
    }
  }, [isProfileError, profile, isProfileLoaded]);

  // Events on UserService.loginUser|loginUserFacebook|loginUserGoogle|loginUserTwitter
  useEffect(() => {
    if (isLoginLoaded || isLoginGoogleLoaded) {
      dispatch(getProfile());
    }
  }, [dispatch, isLoginLoaded, isLoginGoogleLoaded]);

  // Set interval for getProfile every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getProfile());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setUser(undefined);
    router.push("/login");
  };

  const values = {
    isInitialization,
    isInitialized,
    user,
    setUser,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
