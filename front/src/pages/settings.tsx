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
import ConfirmDialog from "@modules/shared/components/ConfirmDialog";
import PasswordInput from "@modules/shared/components/PasswordInput";

// ** Yup Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Interfaces
import {
  IUpdateUserSerializer,
  IChangePasswordSerializer,
} from "@modules/users/interfaces";

// ** MUI Imports
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import { AccountOutline, PhoneIncoming } from "mdi-material-ui";
import { LoadingButton } from "@mui/lab";

const SettingsPage = () => {
  // ** State
  const [phone, setPhone] = useState<string>("");
  const [smsCode, setSmsCode] = useState<string>("");
  const [openTestingCall, setOpenTestingCall] = useState<boolean>(false);

  // ** Hooks
  const { t } = useTranslation();
  const {
    dispatch,
    getProfile,
    testingUserPhoneVoice,
    profileUpdate,
    passwordChange,
    profile,
    isProfileUpdateLoading,
    isProfileUpdateLoaded,
    isProfileUpdateError,
    isPasswordChangeLoading,
    isPasswordChangeLoaded,
    isPasswordChangeError,
    isCreateUserPhoneLoading,
    isResendUserPhoneConfirmLoading,
    isConfirmUserPhoneLoading,
    isTestingUserPhoneVoiceLoading,
    isTestingUserPhoneVoiceLoaded,
    isTestingUserPhoneVoiceError,
    resetProfileUpdateState,
    resetPasswordChangeState,
    resetTestingUserPhoneVoiceState,
  } = useUserService();

  const schemaSettings = yup.object().shape({
    first_name: yup.string(),
    last_name: yup.string(),
  });

  const schemaPasswords = yup.object().shape({
    current_password: yup
      .string()
      .required(t("Password is required"))
      .min(6, t(`Password must be at least {{n}} characters`, { n: 6 })),
    new_password: yup
      .string()
      .required(t("New Password is required"))
      .min(6, t(`Password must be at least {{n}} characters`, { n: 6 })),

    confirm_new_password: yup
      .string()
      .min(6, t(`Confirm Password must be at least {{n}} characters`, { n: 6 }))
      .oneOf([yup.ref("new_password"), null], t(`Passwords must match`)),
  });
  // ** Vars
  const userPhoneFieldRef = useRef<any>(null);
  const {
    reset: resetSettings,
    control: controlSettings,
    setValue: setValueSettings,
    handleSubmit: handleSubmitSettings,
    formState: { errors: errorsSettings },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
    },
    mode: "onBlur",
    resolver: yupResolver(schemaSettings),
  });

  const {
    reset: resetPasswords,
    control: controlPasswords,
    setValue: setValuePasswords,
    handleSubmit: handleSubmitPasswords,
    formState: { errors: errorsPasswords },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    mode: "onBlur",
    resolver: yupResolver(schemaPasswords),
  });

  const onSubmitSettings = (params: IUpdateUserSerializer) => {
    if (!phone.length && !smsCode.length) {
      dispatch(profileUpdate(params));
    } else {
      if (userPhoneFieldRef.current) {
        userPhoneFieldRef.current.handleSubmitSettings();
      }
    }
  };

  const onSubmitPasswords = (params: IChangePasswordSerializer) => {
    dispatch(passwordChange(params));
  };

  const handleTestingCall = () => {
    if (profile?.phones.length) {
      dispatch(
        testingUserPhoneVoice({
          user_phone_id: profile.phones[0].id,
        })
      );
    }
  };

  // Events UserService.fetchProfile
  useEffect(() => {
    resetSettings();

    if (profile) {
      setValueSettings("first_name", profile.first_name || "");
      setValueSettings("last_name", profile.last_name || "");
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

  // Event UserService.passwordChange
  useEffect(() => {
    // Success
    if (isPasswordChangeLoaded) {
      Notify(
        "success",
        t(
          `Your password has been changed! Please log in with your new password.`
        )
      );
      dispatch(resetPasswordChangeState());
      dispatch(getProfile());
    }

    // Error
    if (
      isPasswordChangeError &&
      typeof isPasswordChangeError.response?.data === "object"
    ) {
      if (isPasswordChangeError?.response?.data) {
        Object.entries(isPasswordChangeError.response.data).forEach(
          ([key, value]) => {
            if (value) {
              Notify("error", value.toString());
            }
          }
        );
      }
      dispatch(resetPasswordChangeState());
    } else if (typeof isPasswordChangeError?.response?.data === "string") {
      Notify("error", isPasswordChangeError.response.data.toString());
      dispatch(resetPasswordChangeState());
    }
  }, [isPasswordChangeLoaded, isPasswordChangeError]);

  // Event on UserService.testingUserPhoneVoice
  useEffect(() => {
    // Success
    if (isTestingUserPhoneVoiceLoaded) {
      Notify("info", t(`Test call successfully created!`));
      dispatch(resetTestingUserPhoneVoiceState());
      dispatch(getProfile());
    }

    // Error
    if (
      isTestingUserPhoneVoiceError &&
      typeof isTestingUserPhoneVoiceError.response?.data === "object"
    ) {
      if (isTestingUserPhoneVoiceError?.response?.data) {
        Object.entries(isTestingUserPhoneVoiceError.response.data).forEach(
          ([key, value]) => {
            if (value) {
              Notify("error", value.toString());
            }
          }
        );
      }
      dispatch(resetTestingUserPhoneVoiceState());
    } else if (
      typeof isTestingUserPhoneVoiceError?.response?.data === "string"
    ) {
      Notify("error", isTestingUserPhoneVoiceError.response.data.toString());
      dispatch(resetTestingUserPhoneVoiceState());
    }
  }, [isTestingUserPhoneVoiceLoaded, isTestingUserPhoneVoiceError]);

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Settings`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t(`Profile`)} />
              <CardContent>
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmitSettings(onSubmitSettings)}
                >
                  <Grid container spacing={3}>
                    <Grid item md={6} sm={6} xs={12}>
                      {/* First Name Input */}
                      <FormControl fullWidth>
                        <Controller
                          name="first_name"
                          control={controlSettings}
                          rules={{ required: false }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoComplete="off"
                              placeholder=""
                              label={t(`Full Name`)}
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errorsSettings.first_name)}
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
                        {errorsSettings.first_name && (
                          <FormHelperText sx={{ color: "error.main" }}>
                            {errorsSettings.first_name.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <UserPhoneField
                    ref={userPhoneFieldRef}
                    phone={phone}
                    setPhone={setPhone}
                    smsCode={smsCode}
                    setSmsCode={setSmsCode}
                  />

                  <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item md={6} sm={6} xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 6,
                          mb: 7,
                        }}
                      >
                        <LoadingButton
                          loading={
                            isProfileUpdateLoading ||
                            isCreateUserPhoneLoading ||
                            isConfirmUserPhoneLoading
                          }
                          size="large"
                          type="submit"
                          variant="contained"
                        >
                          {t(`Save Profile`)}
                        </LoadingButton>

                        {profile?.phones.length &&
                        profile.phones[0].status &&
                        !profile.phones[0].is_tested_voice ? (
                          <LoadingButton
                            loading={isTestingUserPhoneVoiceLoading}
                            size="large"
                            variant="outlined"
                            color="info"
                            onClick={() => setOpenTestingCall(true)}
                            endIcon={<PhoneIncoming />}
                            aria-label={t(`Test Call`)}
                          >
                            {t(`Test Call`)}
                          </LoadingButton>
                        ) : null}
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={6} className="match-height" sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t(`Password Change`)} />
              <CardContent>
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmitPasswords(onSubmitPasswords)}
                >
                  <Grid container spacing={3}>
                    <Grid item md={6} sm={6} xs={12}>
                      {/* Current Password */}
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel
                          error={Boolean(errorsPasswords.current_password)}
                        >
                          {t(`Current Password`)}
                        </InputLabel>
                        <Controller
                          name="current_password"
                          control={controlPasswords}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <PasswordInput
                              label={t(`Current Password`)}
                              value={value}
                              setValue={onChange}
                              error={Boolean(errorsPasswords.current_password)}
                            />
                          )}
                        />
                        {errorsPasswords.current_password && (
                          <FormHelperText sx={{ color: "error.main" }}>
                            {errorsPasswords.current_password.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={6} xs={12}>
                      {/* New Password */}
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel
                          error={Boolean(errorsPasswords.new_password)}
                        >
                          {t(`New Password`)}
                        </InputLabel>
                        <Controller
                          name="new_password"
                          control={controlPasswords}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <PasswordInput
                              label={t(`New Password`)}
                              value={value}
                              setValue={onChange}
                              error={Boolean(errorsPasswords.new_password)}
                            />
                          )}
                        />
                        {errorsPasswords.new_password && (
                          <FormHelperText sx={{ color: "error.main" }}>
                            {errorsPasswords.new_password.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={6} xs={12}>
                      {/* New Password Confirm */}
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel
                          error={Boolean(errorsPasswords.confirm_new_password)}
                        >
                          {t(`Confirm New Password`)}
                        </InputLabel>
                        <Controller
                          name="confirm_new_password"
                          control={controlPasswords}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <PasswordInput
                              label={t(`Confirm New Password`)}
                              value={value}
                              setValue={onChange}
                              error={Boolean(
                                errorsPasswords.confirm_new_password
                              )}
                            />
                          )}
                        />
                        {errorsPasswords.confirm_new_password && (
                          <FormHelperText sx={{ color: "error.main" }}>
                            {errorsPasswords.confirm_new_password.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item md={6} sm={6} xs={12}>
                      <Box>
                        <LoadingButton
                          loading={isPasswordChangeLoading}
                          size="large"
                          type="submit"
                          variant="contained"
                        >
                          {t(`Save Password`)}
                        </LoadingButton>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <ConfirmDialog
          open={openTestingCall}
          setOpen={setOpenTestingCall}
          title={t(`There will be a test call to the phone number indicated`)}
          onConfirm={handleTestingCall}
        />
      </main>
    </div>
  );
};

SettingsPage.authGuard = true;
SettingsPage.acl = { action: "read", subject: Permissions.ANY };
SettingsPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

export default SettingsPage;
