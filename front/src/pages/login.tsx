// ** React Imports
import { ReactNode, useEffect } from "react";

// ** Next Imports
import Link from "next/link";
import Head from "next/head";

// ** Hooks
import { useTranslation } from "react-i18next";
import { useUserService } from "@hooks/useUserService";

// ** Shared Components
import Notify from "@modules/shared/utils/Notify";

import {
  Box,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import MuiCard, { CardProps } from "@mui/material/Card";
import { styled, useTheme } from "@mui/material/styles";

// ** Component Imports
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV1 from "@layouts/components/footer/FooterIllustrationsV1";
import Logo from "@layouts/components/Logo";
import SocialAuthComponent from "@modules/shared/components/SocialAuth";
import PasswordInput from "@modules/shared/components/PasswordInput";

// ** Yup Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Types & Interfaces
import { ILoginSerializer } from "@modules/users/interfaces";

// ** Configs
import themeConfig from "@configs/themeConfig";

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "33rem" },
}));

const LoginPage = () => {
  // ** Hooks
  const {
    dispatch,
    login,
    isLoginLoading,
    isLoginError,
    isLoginGoogleLoading,
    resetLoginState,
  } = useUserService();
  const { t } = useTranslation();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t(`Email format is invalid`))
      .required(t("Email is required")),
    password: yup
      .string()
      .required(t("Password is required"))
      .min(6, t(`Password must be at least {{n}} characters`, { n: 6 })),
  });

  // ** Vars
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (params: ILoginSerializer) => {
    dispatch(login(params));
  };

  // Events on UserService.loginUser
  useEffect(() => {
    if (isLoginError) {
      setError("email", {
        type: "manual",
        message: t("Email or Password is invalid"),
      });

      if (isLoginError?.response?.data?.message) {
        Notify("warning", isLoginError.response.data.message);
      }

      dispatch(resetLoginState());
    }
  }, [isLoginError, setError]);

  return (
    <Box className="content-center">
      <Head>
        <title>
          {themeConfig.templateName} - {t(`Sign in`)}
        </title>
      </Head>

      <main>
        <Card sx={{ zIndex: 1 }}>
          <CardContent
            sx={{ p: (theme) => `${theme.spacing(10, 5, 5)} !important` }}
          >
            <Box
              sx={{
                mb: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Logo />
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{ mb: 1.5, fontWeight: 600, letterSpacing: "0.18px" }}
              >
                {t(`Sign in`)}
              </Typography>
              <Typography variant="body2">
                {t(`Log in to your account if you've already registered`)}.
              </Typography>
            </Box>

            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoComplete="off"
                      placeholder="email@domain.com"
                      label={t(`Email`)}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel error={Boolean(errors.password)}>
                  {t(`Password`)}
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <PasswordInput
                      label={t(`Password`)}
                      value={value}
                      setValue={onChange}
                      error={Boolean(errors.password)}
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>

              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <Box></Box>
                <Link
                  passHref
                  href="/reset-password"
                  style={{ color: "primary.main" }}
                >
                  <Typography className="link" sx={{ color: "primary.main" }}>
                    {t(`Forgot Password?`)}
                  </Typography>
                </Link>
              </Box>

              <LoadingButton
                fullWidth
                loading={isLoginLoading || isLoginGoogleLoading}
                size="large"
                type="submit"
                variant="contained"
                sx={{ mb: 7 }}
              >
                {t(`Login`)}
              </LoadingButton>
            </form>

            <Divider sx={{ mb: 5, "& .MuiDivider-wrapper": { px: 4 } }}>
              {t(`or log in using social networks`)}:
            </Divider>

            <SocialAuthComponent isRegister={false} />

            <Box
              sx={{
                mt: 5,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ mr: 2, color: "text.secondary" }}>
                {t(`Not registered yet?`)}
              </Typography>

              <Link passHref href="/register">
                <Typography className="link" sx={{ color: "primary.main" }}>
                  {t(`Registration`)}
                </Typography>
              </Link>
            </Box>
          </CardContent>
        </Card>
      </main>

      {/* <FooterIllustrationsV1 /> */}
    </Box>
  );
};

export default LoginPage;

LoginPage.guestGuard = true;
LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
