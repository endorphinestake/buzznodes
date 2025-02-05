// ** React Imports
import { ChangeEvent, memo, useCallback } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Mui Imports
import { MenuItem, TextField } from "@mui/material";

// ** Types & Interfaces
import { EAlertType } from "@modules/alerts/enums";

interface IProps {
  label?: string;
  value: EAlertType;
  setValue: (value: EAlertType) => void;
  error?: boolean;
}

const SelectAlertType = (props: IProps) => {
  // ** Props
  const { label, value, setValue, error } = props;

  // ** Hooks
  const { t } = useTranslation();

  const handleStatusChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value as EAlertType);
    },
    [setValue]
  );

  return (
    <TextField
      error={error}
      select
      fullWidth
      value={value}
      label={label || t(`Alert Type`)}
      onChange={handleStatusChange}
      inputProps={{
        placeholder: label || t(`Alert Type`),
      }}
    >
      <MenuItem value={EAlertType.ANY}>{t(`All`)}</MenuItem>
      <MenuItem value={EAlertType.VOTING_POWER}>{t(`Voting Power`)}</MenuItem>
      <MenuItem value={EAlertType.UPTIME}>{t(`Uptime`)}</MenuItem>
      <MenuItem value={EAlertType.COMISSION}>{t(`Comission`)}</MenuItem>
      <MenuItem value={EAlertType.JAILED}>{t(`Jailed status`)}</MenuItem>
      <MenuItem value={EAlertType.TOMBSTONED}>
        {t(`Tombstoned status`)}
      </MenuItem>
    </TextField>
  );
};

export default memo(SelectAlertType);
