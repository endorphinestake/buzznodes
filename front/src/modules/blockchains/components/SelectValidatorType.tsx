// ** React Imports
import { ChangeEvent, memo, useCallback } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Mui Imports
import { MenuItem, TextField } from "@mui/material";

// ** Types & Interfaces
import { EBlockchainValidatorType } from "@modules/blockchains/enums";

interface IProps {
  label?: string;
  value: EBlockchainValidatorType;
  setValue: (value: EBlockchainValidatorType) => void;
  error?: boolean;
}

const SelectValidatorType = (props: IProps) => {
  // ** Props
  const { label, value, setValue, error } = props;

  // ** Hooks
  const { t } = useTranslation();

  const handleStatusChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value as EBlockchainValidatorType);
    },
    [setValue]
  );

  return (
    <TextField
      error={error}
      select
      fullWidth
      value={value}
      label={label || t(`Validator Type`)}
      onChange={handleStatusChange}
      inputProps={{
        placeholder: label || t(`Validator Type`),
      }}
    >
      <MenuItem value={EBlockchainValidatorType.ANY}>{t(`All`)}</MenuItem>
      <MenuItem value={EBlockchainValidatorType.VALIDATOR}>
        {t(`Validators`)}
      </MenuItem>
      <MenuItem value={EBlockchainValidatorType.BRIDGE}>
        {t(`Bridges`)}
      </MenuItem>
    </TextField>
  );
};

export default memo(SelectValidatorType);
