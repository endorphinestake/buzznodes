// ** React Imports
import {
  ChangeEvent,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";

// ** Hooks
import { useTranslation } from "react-i18next";
import { useUserService } from "@hooks/useUserService";

// ** Shared Components
import Notify from "@modules/shared/utils/Notify";

// ** Mui Imports
import { TextField, InputAdornment, Grid } from "@mui/material";
import { Phone, Cellphone } from "mdi-material-ui";

interface IProps {
  phone: string;
  setPhone: (value: string) => void;
  smsCode: string;
  setSmsCode: (value: string) => void;
}

const UserPhoneField = forwardRef(
  ({ phone, setPhone, smsCode, setSmsCode }: IProps, ref) => {
    // ** Hooks
    const { t } = useTranslation();
    const {
      dispatch,
      getProfile,
      createUserPhone,
      confirmUserPhone,
      profile,
      isProfileUpdateLoading,
      isProfileUpdateLoaded,
      isProfileUpdateError,
      isCreateUserPhoneLoading,
      isCreateUserPhoneLoaded,
      isCreateUserPhoneError,
      isConfirmUserPhoneLoading,
      isConfirmUserPhoneLoaded,
      isConfirmUserPhoneError,
      resetProfileUpdateState,
      resetConfirmUserPhoneState,
      resetCreateUserPhoneState,
    } = useUserService();

    const handleSubmit = () => {
      if (phone.length && !profile?.phones.length) {
        dispatch(
          createUserPhone({
            phone: phone,
          })
        );
      } else if (smsCode.length && profile?.phones.length) {
        dispatch(
          confirmUserPhone({
            code: smsCode,
          })
        );
      }
    };

    useImperativeHandle(ref, () => ({
      handleSubmit,
    }));

    const handleChangePhone = (event: ChangeEvent<HTMLInputElement>) => {
      setPhone(event.target.value);
    };

    const handleChangeSmsCode = (event: ChangeEvent<HTMLInputElement>) => {
      setSmsCode(event.target.value);
    };

    // Events for createUserPhone
    useEffect(() => {
      // Success
      if (isCreateUserPhoneLoaded) {
        setPhone("");
        dispatch(resetCreateUserPhoneState());
        dispatch(getProfile());
      }

      // Error
      if (
        isCreateUserPhoneError &&
        typeof isCreateUserPhoneError.response?.data === "object"
      ) {
        if (isCreateUserPhoneError?.response?.data) {
          Object.entries(isCreateUserPhoneError.response.data).forEach(
            ([key, value]) => {
              if (value) {
                Notify("error", value.toString());
              }
            }
          );
        }
        dispatch(resetCreateUserPhoneState());
      }
    }, [isCreateUserPhoneLoaded, isCreateUserPhoneError]);

    // Events for confirmUserPhone
    useEffect(() => {
      // Success
      if (isConfirmUserPhoneLoaded) {
        Notify(
          "success",
          t("Your phone number has been successfully verified, thank you!")
        );
        setSmsCode("");
        dispatch(resetConfirmUserPhoneState());
        dispatch(getProfile());
      }

      // Error
      if (
        isConfirmUserPhoneError &&
        typeof isConfirmUserPhoneError.response?.data === "object"
      ) {
        if (isConfirmUserPhoneError?.response?.data) {
          Object.entries(isConfirmUserPhoneError.response.data).forEach(
            ([key, value]) => {
              if (value) {
                Notify("error", value.toString());
              }
            }
          );
        }
        dispatch(resetCreateUserPhoneState());
      }
    }, [isConfirmUserPhoneLoaded, isConfirmUserPhoneError]);

    return (
      <>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item md={6} sm={6} xs={12}>
            {/* Phone Input */}
            <TextField
              disabled={
                Boolean(profile?.phones.length) ||
                isCreateUserPhoneLoading ||
                isCreateUserPhoneLoaded
              }
              fullWidth
              type="number"
              autoComplete="off"
              placeholder={
                Boolean(profile?.phones.length)
                  ? profile.phones[0].phone
                  : phone || "+1-123-456-8790"
              }
              label={t(`Phone No.`)}
              value={phone}
              onChange={handleChangePhone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {profile?.phones.length && !profile.phones[0].status ? (
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item md={6} sm={6} xs={12}>
              {/* SMS Code Input */}
              <TextField
                fullWidth
                // type="number"
                autoComplete="off"
                placeholder="12345"
                label={t(`Code from SMS`)}
                value={smsCode}
                onChange={handleChangeSmsCode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cellphone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        ) : null}
      </>
    );
  }
);

export default UserPhoneField;
