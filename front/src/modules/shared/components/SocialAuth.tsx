// ** React Imports
import { useEffect, MouseEvent } from "react";

// ** Next Imports
import { useRouter } from "next/router";

// ** Hooks
import { useTranslation } from "react-i18next";
import { useGoogleLogin } from "@react-oauth/google";
import { useUserService } from "@hooks/useUserService";

// ** Components
import Notify from "@modules/shared/utils/Notify";
import { GoogleLoginButton } from "react-social-login-buttons";

// ** MUI Imports
import { Grid } from "@mui/material";

interface IProps {
  isRegister: boolean;
}

const SocialAuthComponent = (props: IProps) => {
  // ** Props
  const { isRegister } = props;

  // ** Hooks
  const router = useRouter();
  const { t } = useTranslation();
  const {
    dispatch,
    loginGoogle,

    isLoginGoogleLoaded,
    isLoginGoogleError,
    resetLoginGoogleState,
  } = useUserService();

  const { oauth_token, oauth_verifier } = router.query;

  const loginUserGoogle = useGoogleLogin({
    onError: (error) => {
      Notify(
        "error",
        t(`{{social}}: authentication failed!`, { social: "Google" })
      );
      dispatch(resetLoginGoogleState());
    },
    onSuccess: (response) => {
      dispatch(
        loginGoogle({
          access_token: response["access_token"],
          is_register: isRegister,
        })
      );
    },
  });

  // Events on UserService.loginUserGoogle
  useEffect(() => {
    if (isLoginGoogleError) {
      Notify(
        "error",
        t(`{{social}}: authentication failed!`, { social: "Google" })
      );
      dispatch(resetLoginGoogleState());
    }

    if (isLoginGoogleLoaded && isRegister) {
      Notify(
        "success",
        t(`Your registration was successful! Thank you for choosing us!`)
      );
      dispatch(resetLoginGoogleState());
    }
  }, [isLoginGoogleError, isLoginGoogleLoaded]);

  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <GoogleLoginButton
          text="Google"
          size="45px"
          onClick={() => loginUserGoogle()}
        />
      </Grid>
    </Grid>
  );
};

export default SocialAuthComponent;
