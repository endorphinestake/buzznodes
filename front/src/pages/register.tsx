// ** React Imports
import { useState, useEffect, Fragment, ReactNode, MouseEvent } from "react";

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
  Checkbox,
  FormHelperText,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import MuiLink from "@mui/material/Link";
import MuiCard, { CardProps } from "@mui/material/Card";
import { styled, useTheme } from "@mui/material/styles";

// ** Component Imports
import BlankLayout from "src/@core/layouts/BlankLayout";
import FooterIllustrationsV1 from "@layouts/components/footer/FooterIllustrationsV1";
import Logo from "@layouts/components/Logo";
import SocialAuthComponent from "@modules/shared/components/SocialAuth";

// ** Shared Components Imports
import PasswordInput from "@modules/shared/components/PasswordInput";
import TermsConditionsModalEn from "@modules/shared/components/TermsConditionsModalEn";
import TermsConditionsModalRu from "@modules/shared/components/TermsConditionsModalRu";
import TermsConditionsModalUk from "@modules/shared/components/TermsConditionsModalUk";
import Notify from "@modules/shared/utils/Notify";

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

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    marginBottom: theme.spacing(4),
    "& .MuiFormControlLabel-label": {
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
    },
  })
);

interface IFormProps {
  email: string;
  password: string;
  agree: boolean;
}

const RegisterPage = () => {
  // ** Hook
  const router = useRouter();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const {
    dispatch,
    register,
    resetRegisterState,
    isRegisterLoading,
    isRegisterLoaded,
    isRegisterError,
  } = useUserService();

  // ** State
  const [showTerms, setShowTerms] = useState<boolean>(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t(`Email format is invalid`))
      .required(t("Email is required")),
    password: yup
      .string()
      .required(t("Password is required"))
      .min(6, t(`Password must be at least {{n}} characters`, { n: 6 })),
    agree: yup
      .boolean()
      .oneOf([true], t(`You must acknowledge the terms and conditions`)),
  });

  // ** Vars
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      agree: false,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (params: IFormProps) => {
    dispatch(register(params));
  };

  // Events on UserService.register
  useEffect(() => {
    // isError
    if (isRegisterError && typeof isRegisterError.response?.data === "object") {
      if (isRegisterError?.response?.data) {
        Object.entries(isRegisterError.response.data).forEach(
          ([key, value]) => {
            if (value) {
              Notify("error", value.toString());
            }
          }
        );
      }
      dispatch(resetRegisterState());
    }

    // isSuccess
    if (isRegisterLoaded) {
      Notify(
        "success",
        t(
          `Account created! Find the email in your mailbox and click on the link to complete the registration`
        )
      );
      dispatch(resetRegisterState());
      router.push("/login");
    }
  }, [dispatch, setError, isRegisterLoaded, isRegisterError]);

  return (
    <Box className="content-center">
      <Head>
        <title>
          {themeConfig.templateName} - {t(`Registration`)}
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
                sx={{ mb: 1.5, letterSpacing: "0.18px", fontWeight: 600 }}
              >
                {t(`Registration`)}
              </Typography>
              {/* <Typography variant='body2'>
              {t(`After registration, you will be able to test SMS delivery to real subscriber numbers in over 200 countries worldwide`)}.
            </Typography> */}
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

              <FormControl fullWidth sx={{ mb: 4 }}>
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
                      isGenerate={true}
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

              <FormControl fullWidth>
                <Controller
                  name="agree"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <FormControlLabel
                      control={<Checkbox value={value} onChange={onChange} />}
                      label={
                        <Fragment>
                          <span>{t(`I accept the`)} </span>
                          <Link href="/" passHref>
                            <Typography
                              variant="body2"
                              component="span"
                              className="link"
                              onClick={(e: MouseEvent<HTMLElement>) => {
                                setShowTerms(true);
                                e.preventDefault();
                              }}
                              sx={{ color: "primary.main" }}
                            >
                              {t(`terms & conditions`)}
                            </Typography>
                          </Link>
                        </Fragment>
                      }
                    />
                  )}
                />
                {errors.agree && (
                  <FormHelperText sx={{ color: "error.main", mb: 2 }}>
                    {errors.agree.message}
                  </FormHelperText>
                )}
              </FormControl>

              <LoadingButton
                fullWidth
                loading={isRegisterLoading}
                size="large"
                type="submit"
                variant="contained"
                sx={{ mb: 7 }}
              >
                {t(`Create an account`)}
              </LoadingButton>
              {/* <Divider
              sx={{ mb: 5, '& .MuiDivider-wrapper': { px: 4 } }}
            >
              {t(`or register using social networks`)}:
            </Divider> */}

              {/* <SocialAuthComponent isRegister={true} /> */}

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
                  {t(`Are you already registered?`)}
                </Typography>
                <Typography>
                  <Link passHref href="/login">
                    <Typography
                      component={"span"}
                      className="link"
                      sx={{ color: "primary.main" }}
                    >
                      {t(`Sign in instead`)}
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </main>

      {i18n.language.split("-")[0] === "ru" ? (
        <TermsConditionsModalRu open={showTerms} setOpen={setShowTerms} />
      ) : i18n.language.split("-")[0] === "uk" ? (
        <TermsConditionsModalUk open={showTerms} setOpen={setShowTerms} />
      ) : (
        <TermsConditionsModalEn open={showTerms} setOpen={setShowTerms} />
      )}

      {/* <FooterIllustrationsV1
        image={`/images/pages/auth-v1-register-mask-${theme.palette.mode}.png`}
      /> */}
    </Box>
  );
};

export default RegisterPage;

RegisterPage.guestGuard = true;
RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
