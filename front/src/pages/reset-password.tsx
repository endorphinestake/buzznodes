// ** React Imports
import { ReactNode, useEffect } from "react";

// ** Next Imports
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Icons Imports
import ChevronLeft from "mdi-material-ui/ChevronLeft";

// ** Component Imports
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV1 from "@layouts/components/footer/FooterIllustrationsV1";
import Logo from "@layouts/components/Logo";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";

// ** Yup Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Hooks
import { useUserService } from "@hooks/useUserService";

// ** Mui Imports
import {
  Box,
  CardContent,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import MuiLink from "@mui/material/Link";
import MuiCard, { CardProps } from "@mui/material/Card";
import { styled, useTheme } from "@mui/material/styles";

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "33rem" },
}));

interface IFormProps {
  email: string;
}

const ResetPasswordPage = () => {
  // ** Hook
  const router = useRouter();
  const {
    dispatch,
    resetPassword,
    isResetPasswordLoading,
    isResetPasswordLoaded,
    isResetPasswordError,
    resetResetPasswordState,
  } = useUserService();
  const theme = useTheme();
  const { t } = useTranslation();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t(`Email format is invalid`))
      .required(t("Email is required")),
  });

  // ** Vars
  const {
    control,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (params: IFormProps) => {
    dispatch(
      resetPassword({
        email: params.email,
      })
    );
  };

  // Events on resetPassword state change
  useEffect(() => {
    if (isResetPasswordError) {
      setError("email", {
        type: "manual",
        message: t("This email is not registered"),
      });
    }

    if (isResetPasswordLoaded) {
      dispatch(resetResetPasswordState());
      Notify(
        "success",
        t("An email with a password reset link has been sent to your mailbox.")
      );
      router.push(`/login`);
    }
  }, [isResetPasswordLoaded, isResetPasswordError]);

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

          <Box sx={{ mb: 6.5 }}>
            <Typography
              variant="h5"
              sx={{ mb: 1.5, letterSpacing: "0.18px", fontWeight: 600 }}
            >
              {t(`Forgot Password?`)} 🔒
            </Typography>
            <Typography variant="body2">
              {t(
                `Enter your email and we'll send you instructions to reset the password`
              )}
              .
            </Typography>
          </Box>

          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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

            <LoadingButton
              fullWidth
              loading={isResetPasswordLoading}
              size="large"
              type="submit"
              variant="contained"
              sx={{ mb: 7 }}
            >
              {t("Submit")}
            </LoadingButton>

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
                <span>{t(`Back to login`)}</span>
              </Typography>
            </Link>
          </form>
        </CardContent>
      </Card>

      {/* <FooterIllustrationsV1
        image={`/images/pages/auth-v1-forgot-password-mask-${theme.palette.mode}.png`}
      /> */}
    </Box>
  );
};

export default ResetPasswordPage;

ResetPasswordPage.guestGuard = true;
ResetPasswordPage.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
);
