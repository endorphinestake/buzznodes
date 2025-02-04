// ** React Imports
import { ReactNode, useEffect, useState, useRef } from "react";

// ** NextJS Imports
import Head from "next/head";

// ** Configs
import { Permissions } from "@configs/acl";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useUserService } from "@hooks/useUserService";

// ** Layouts
import UserLayout from "@layouts/UserLayout";

// ** Shared Components
import styles from "@styles/Home.module.css";
import Notify from "@modules/shared/utils/Notify";
import UserPhoneField from "@modules/users/components/UserPhoneField";

// ** Yup Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Interfaces
import { IUpdateUserSerializer } from "@modules/users/interfaces";

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { EmailOutline, Phone, AccountOutline } from "mdi-material-ui";
import { LoadingButton } from "@mui/lab";

const SettingsPage = () => {
  // ** State
  const [phone, setPhone] = useState<string>("");

  // ** Hooks
  const { t } = useTranslation();
  const {
    dispatch,
    getProfile,
    profileUpdate,
    profile,
    isProfileUpdateLoading,
    isProfileUpdateLoaded,
    isProfileUpdateError,
    isCreateUserPhoneLoading,
    isResendUserPhoneConfirmLoading,
    isConfirmUserPhoneLoading,
    resetProfileUpdateState,
  } = useUserService();

  const schema = yup.object().shape({
    first_name: yup.string(),
    last_name: yup.string(),
  });

  // ** Vars
  const userPhoneFieldRef = useRef<any>(null);
  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (params: IUpdateUserSerializer) => {
    if (!phone.length) {
      dispatch(profileUpdate(params));
    } else {
      console.log("phone todo...");
      if (userPhoneFieldRef.current) {
        userPhoneFieldRef.current.handleSubmit();
      }
    }
  };

  // Events UserService.fetchProfile
  useEffect(() => {
    reset();

    if (profile) {
      setValue("first_name", profile.first_name || "");
      setValue("last_name", profile.last_name || "");
    }
  }, []);

  // Event UserService.updateProfile
  useEffect(() => {
    // Success
    if (isProfileUpdateLoaded) {
      Notify(
        "success",
        t(`Your profile information has been successfully saved!`)
      );
      dispatch(resetProfileUpdateState());
      dispatch(getProfile());
    }

    // Error
    if (isProfileUpdateError) {
      Notify(
        "error",
        t(`Unable to save profile information. Please try again later.`)
      );
      dispatch(resetProfileUpdateState());
    }
  }, [isProfileUpdateLoaded, isProfileUpdateError]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Settings`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t(`Settings`)} />
              <CardContent>
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* <Box
                    sx={{
                      my: 5,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <AccountOutline sx={{ fontSize: "1.5rem", mr: 2 }} />
                    <Typography sx={{ fontWeight: "bold" }}>
                      {t(`Profile`)}
                    </Typography>
                  </Box> */}

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={6} xs={12}>
                      {/* First Name Input */}
                      <FormControl fullWidth>
                        <Controller
                          name="first_name"
                          control={control}
                          rules={{ required: false }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoComplete="off"
                              placeholder=""
                              label={t(`Full Name`)}
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.first_name)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountOutline />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                        {errors.first_name && (
                          <FormHelperText sx={{ color: "error.main" }}>
                            {errors.first_name.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <UserPhoneField
                    ref={userPhoneFieldRef}
                    value={phone}
                    setValue={setPhone}
                  />

                  <Box sx={{ display: "flex", alignItems: "center", mt: 6 }}>
                    <LoadingButton
                      loading={
                        isProfileUpdateLoading ||
                        isCreateUserPhoneLoading ||
                        isResendUserPhoneConfirmLoading ||
                        isConfirmUserPhoneLoading
                      }
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{ mb: 7 }}
                    >
                      {t(`Save changes`)}
                    </LoadingButton>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

SettingsPage.authGuard = true;
SettingsPage.acl = { action: "read", subject: Permissions.ANY };
SettingsPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

export default SettingsPage;
