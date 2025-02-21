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

// ** Yup Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Interfaces
import { IUpdateUserSerializer } from "@modules/users/interfaces";

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
    profile,
    isProfileUpdateLoading,
    isProfileUpdateLoaded,
    isProfileUpdateError,
    isCreateUserPhoneLoading,
    isResendUserPhoneConfirmLoading,
    isConfirmUserPhoneLoading,
    isTestingUserPhoneVoiceLoading,
    isTestingUserPhoneVoiceLoaded,
    isTestingUserPhoneVoiceError,
    resetProfileUpdateState,
    resetTestingUserPhoneVoiceState,
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
    if (!phone.length && !smsCode.length) {
      dispatch(profileUpdate(params));
    } else {
      if (userPhoneFieldRef.current) {
        userPhoneFieldRef.current.handleSubmit();
      }
    }
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
              <CardHeader title={t(`Settings`)} />
              <CardContent>
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                >
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
                          aria-label={t(`Save changes`)}
                        >
                          {t(`Save changes`)}
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
