// ** React Imports
import { ChangeEvent, useImperativeHandle, forwardRef, useState } from "react";

// ** Hooks
import { useTranslation } from "react-i18next";
import { useUserService } from "@hooks/useUserService";

// ** Shared Components
import Notify from "@modules/shared/utils/Notify";

// ** Mui Imports
import { TextField, InputAdornment, Grid } from "@mui/material";
import { Phone, Cellphone } from "mdi-material-ui";

interface IProps {
  value: string;
  setValue: (value: string) => void;
}

const UserPhoneField = forwardRef(({ value, setValue }: IProps, ref) => {
  // ** State
  const [smsCode, setSmsCode] = useState<string>("");

  // ** Hooks
  const { t } = useTranslation();
  const {
    dispatch,
    getProfile,
    profile,
    isProfileUpdateLoading,
    isProfileUpdateLoaded,
    isProfileUpdateError,
    resetProfileUpdateState,
  } = useUserService();

  const handleSubmit = () => {
    console.log("use request!", value);
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleChangePhone = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleChangeSmsCode = (event: ChangeEvent<HTMLInputElement>) => {
    setSmsCode(event.target.value);
  };

  return (
    <>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item md={6} sm={6} xs={12}>
          {/* Phone Input */}
          <TextField
            disabled={Boolean(profile?.phones.length)}
            fullWidth
            type="number"
            autoComplete="off"
            placeholder="+1-123-456-8790"
            label={t(`Phone No.`)}
            value={value}
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
              type="number"
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
});

export default UserPhoneField;
