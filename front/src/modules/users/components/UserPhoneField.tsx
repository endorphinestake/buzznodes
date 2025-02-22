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
import ConfirmDialog from "@modules/shared/components/ConfirmDialog";

// ** Mui Imports
import {
  TextField,
  InputAdornment,
  Grid,
  Tooltip,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Phone, Cellphone, CloseThick } from "mdi-material-ui";

interface IProps {
  phone: string;
  setPhone: (value: string) => void;
  smsCode: string;
  setSmsCode: (value: string) => void;
}

const UserPhoneField = forwardRef(
  ({ phone, setPhone, smsCode, setSmsCode }: IProps, ref) => {
    // ** State
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    // ** Hooks
    const { t } = useTranslation();
    const {
      dispatch,
      getProfile,
      createUserPhone,
      deleteUserPhone,
      confirmUserPhone,
      resendUserPhoneConfirm,
      profile,
      isCreateUserPhoneLoading,
      isCreateUserPhoneLoaded,
      isCreateUserPhoneError,
      isDeleteUserPhoneLoading,
      isDeleteUserPhoneLoaded,
      isDeleteUserPhoneError,
      isConfirmUserPhoneLoading,
      isConfirmUserPhoneLoaded,
      isConfirmUserPhoneError,
      isResendUserPhoneConfirmLoading,
      isResendUserPhoneConfirmLoaded,
      isResendUserPhoneConfirmError,
      resetConfirmUserPhoneState,
      resetCreateUserPhoneState,
      resetDeleteUserPhoneState,
      resetResendUserPhoneConfirmState,
    } = useUserService();

    const handleSubmitSettings = () => {
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
      handleSubmitSettings,
    }));

    const handleChangePhone = (event: ChangeEvent<HTMLInputElement>) => {
      setPhone(event.target.value);
    };

    const handleChangeSmsCode = (event: ChangeEvent<HTMLInputElement>) => {
      setSmsCode(event.target.value);
    };

    const handleClickResend = () => {
      if (profile?.phones[0]?.last_sent_confirm) {
        dispatch(
          resendUserPhoneConfirm({
            user_phone_id: profile.phones[0].id,
          })
        );
        dispatch(getProfile());
      }
    };

    const handleDelete = () => {
      if (profile?.phones.length) {
        dispatch(
          deleteUserPhone({
            user_phone_id: profile.phones[0].id,
          })
        );
        dispatch(getProfile());
      }
    };

    // Events for createUserPhone
    useEffect(() => {
      // Success
      if (isCreateUserPhoneLoaded) {
        Notify("info", t(`Please confirm your number via SMS code`));
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

    // Events for deleteUserPhone
    useEffect(() => {
      // Success
      if (isDeleteUserPhoneLoaded) {
        Notify("info", t(`The phone successfully deleted!`));
        setPhone("");
        dispatch(resetDeleteUserPhoneState());
        dispatch(getProfile());
      }

      // Error
      if (
        isDeleteUserPhoneError &&
        typeof isDeleteUserPhoneError.response?.data === "object"
      ) {
        if (isDeleteUserPhoneError?.response?.data) {
          Object.entries(isDeleteUserPhoneError.response.data).forEach(
            ([key, value]) => {
              if (value) {
                Notify("error", value.toString());
              }
            }
          );
        }
        dispatch(resetDeleteUserPhoneState());
      }
    }, [isDeleteUserPhoneLoaded, isDeleteUserPhoneError]);

    // Events for confirmUserPhone
    useEffect(() => {
      // Success
      if (isConfirmUserPhoneLoaded) {
        Notify(
          "success",
          t(`Your phone number has been successfully verified, thank you!`)
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
        dispatch(resetConfirmUserPhoneState());
      }
    }, [isConfirmUserPhoneLoaded, isConfirmUserPhoneError]);

    // Events for resendUserPhoneConfirm
    useEffect(() => {
      // Success
      if (isResendUserPhoneConfirmLoaded) {
        Notify("success", t(`Repeated SMS with confirmation code sent`));
        dispatch(resetResendUserPhoneConfirmState());
        dispatch(getProfile());
      }

      // Error
      if (
        isResendUserPhoneConfirmError &&
        typeof isResendUserPhoneConfirmError.response?.data === "object"
      ) {
        if (isResendUserPhoneConfirmError?.response?.data) {
          Object.entries(isResendUserPhoneConfirmError.response.data).forEach(
            ([key, value]) => {
              if (value) {
                Notify("error", value.toString());
              }
            }
          );
        }
        dispatch(resetResendUserPhoneConfirmState());
      } else if (
        typeof isResendUserPhoneConfirmError?.response?.data === "string"
      ) {
        Notify("error", isResendUserPhoneConfirmError.response.data.toString());
        dispatch(resetResendUserPhoneConfirmState());
      }
    }, [isResendUserPhoneConfirmLoaded, isResendUserPhoneConfirmError]);

    // Timer for Resend SMS Code
    useEffect(() => {
      if (!profile?.phones[0]?.last_sent_confirm) return;

      const lastSentTime = new Date(
        profile.phones[0].last_sent_confirm
      ).getTime();

      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.floor((now - lastSentTime) / 1000);
        setTimeLeft(Math.max(60 - diff, 0)); // 60 sec.
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }, [profile]);

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
                  ? profile?.phones[0]?.phone
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
                endAdornment: Boolean(profile?.phones.length) ? (
                  <IconButton edge="end" onClick={() => setOpenDelete(true)}>
                    <Tooltip
                      title={t(
                        "Delete the phone number. After deleting you can add a new phone"
                      )}
                    >
                      <CloseThick fontSize="small" color="error" />
                    </Tooltip>
                  </IconButton>
                ) : null,
              }}
            />
          </Grid>
        </Grid>

        {profile?.phones.length && !profile.phones[0].status ? (
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item md={3} sm={3} xs={12}>
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
            <Grid item md={2} sm={2} xs={12}>
              <Tooltip
                title={
                  timeLeft !== null && timeLeft > 0
                    ? t(`You can resend the SMS code in ${timeLeft} sec.`)
                    : t(`Didn't receive the code? Click to resend`)
                }
              >
                <span>
                  <LoadingButton
                    loading={isResendUserPhoneConfirmLoading}
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleClickResend}
                    sx={{ mt: 2 }}
                    disabled={
                      (timeLeft !== null && timeLeft > 0) ||
                      isConfirmUserPhoneLoading
                    }
                  >
                    {timeLeft !== null && timeLeft > 0
                      ? `${timeLeft} sec.`
                      : t(`Resend SMS`)}
                  </LoadingButton>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        ) : null}

        <ConfirmDialog
          open={openDelete}
          setOpen={setOpenDelete}
          title={t(`Are you sure you want to delete the phone number?`)}
          onConfirm={handleDelete}
        />
      </>
    );
  }
);

export default UserPhoneField;
