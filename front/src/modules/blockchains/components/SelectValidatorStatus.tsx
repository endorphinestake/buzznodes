// ** React Imports
import { ChangeEvent, memo, useCallback } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Mui Imports
import { MenuItem, TextField } from "@mui/material";

// ** Types & Interfaces
import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";

interface IProps {
  label?: string;
  value: EBlockchainValidatorStatus;
  setValue: (value: EBlockchainValidatorStatus) => void;
  error?: boolean;
}

const SelectValidatorStatus = (props: IProps) => {
  // ** Props
  const { label, value, setValue, error } = props;

  // ** Hooks
  const { t } = useTranslation();

  const handleStatusChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value as EBlockchainValidatorStatus);
    },
    [setValue]
  );

  return (
    <TextField
      error={error}
      select
      fullWidth
      value={value}
      label={label || t(`Validator Status`)}
      onChange={handleStatusChange}
      inputProps={{
        placeholder: label || t(`Validator Status`),
      }}
    >
      <MenuItem value={EBlockchainValidatorStatus.BOND_STATUS_BONDED}>
        {t(`Active`)}
      </MenuItem>
      <MenuItem value={EBlockchainValidatorStatus.BOND_STATUS_UNBONDED}>
        {t("Inactive")}
      </MenuItem>
    </TextField>
  );
};

export default memo(SelectValidatorStatus);
