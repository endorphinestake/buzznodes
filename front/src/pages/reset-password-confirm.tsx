// ** React Imports
import { ReactNode, useEffect } from "react";

// ** Next Imports
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Mui Imports
import {
  Box,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import MuiCard, { CardProps } from "@mui/material/Card";
import { styled, useTheme } from "@mui/material/styles";

// ** Icons Imports
import ChevronLeft from "mdi-material-ui/ChevronLeft";

// ** Component Imports
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV1 from "@layouts/components/footer/FooterIllustrationsV1";
import Logo from "@layouts/components/Logo";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";

// ** Shared Components Imports
import PasswordInput from "@modules/shared/components/PasswordInput";

// ** Yup Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Hooks
import { useUserService } from "@hooks/useUserService";

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "33rem" },
}));

interface IFormProps {
  password: string;
  passwordConfirm: string;
}

const ResetPasswordConfirmPage = () => {
  // ** Hook
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    dispatch,
    resetPasswordConfirm,
    isResetPasswordConfirmLoading,
    isResetPasswordConfirmLoaded,
    isResetPasswordConfirmError,
    resetResetPasswordConfirmState,
  } = useUserService();

  const schema = yup.object().shape({
    password: yup
      .string()
      .required(t("Password is required"))
      .min(6, t(`Password must be at least {{n}} characters`, { n: 6 })),

    passwordConfirm: yup
      .string()
      .min(6, t(`Password must be at least {{n}} characters`, { n: 6 }))
      .oneOf([yup.ref("password"), null], t(`Passwords must match`)),
  });

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (params: IFormProps) => {
    dispatch(
      resetPasswordConfirm({
        new_password: params.password,
        confirm_new_password: params.passwordConfirm,
        token: router.query.token,
      })
    );
  };

  // Events on resetPasswordConfirm state change
  useEffect(() => {
    // isError
    if (isResetPasswordConfirmError) {
      Notify("error", t(`Confirmation code is incorrect or has expired!`));
      dispatch(resetResetPasswordConfirmState());
    }

    // isSuccess
    if (isResetPasswordConfirmLoaded) {
      Notify(
        "success",
        t(`Your password has been changed! You can now log into into account`)
      );
      dispatch(resetResetPasswordConfirmState());
      router.push("/login");
    }
  }, [isResetPasswordConfirmError, isResetPasswordConfirmLoaded]);

  return (
    <Box className="content-center">
      <Head>
        <title>
          {themeConfig.templateName} - {t(`Password recovery`)}
        </title>
      </Head>

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
              sx={{ mb: 1.5, letterSpacing: "0.18px", fontWeight: 600 }}
            >
              {t(`Reset Password`)} 🔒
            </Typography>
            <Typography variant="body2">
              {t(`Please specify your new password for the account`)}.
            </Typography>
          </Box>

          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel error={Boolean(errors.password)}>
                {t(`New Password`)}
              </InputLabel>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <PasswordInput
                    label={t(`New Password`)}
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

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel error={Boolean(errors.passwordConfirm)}>
                {t(`Confirm Password`)}
              </InputLabel>
              <Controller
                name="passwordConfirm"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <PasswordInput
                    label={t(`Confirm Password`)}
                    value={value}
                    setValue={onChange}
                    error={Boolean(errors.passwordConfirm)}
                  />
                )}
              />
              {errors.passwordConfirm && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.passwordConfirm.message}
                </FormHelperText>
              )}
            </FormControl>

            <LoadingButton
              fullWidth
              loading={isResetPasswordConfirmLoading}
              size="large"
              type="submit"
              variant="contained"
              sx={{ mb: 7 }}
            >
              {t(`Set New Password`)}
            </LoadingButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link passHref href="/login">
                <Typography
                  className="link"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "primary.main",
                    justifyContent: "center",
                  }}
                >
                  <ChevronLeft sx={{ mr: 1.5, fontSize: "2rem" }} />
                  {t(`Back to login`)}
                </Typography>
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>

      <FooterIllustrationsV1
        image={`/images/pages/auth-v1-reset-password-mask-${theme.palette.mode}.png`}
      />
    </Box>
  );
};

export default ResetPasswordConfirmPage;

ResetPasswordConfirmPage.guestGuard = true;
ResetPasswordConfirmPage.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
);
