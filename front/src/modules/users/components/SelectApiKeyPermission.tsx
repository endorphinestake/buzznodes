// ** React Imports
import { ChangeEvent, memo, useCallback } from 'react';

// ** Hooks Imports
import { useTranslation } from 'react-i18next';

// ** Mui Imports
import { MenuItem, TextField } from '@mui/material';

// ** Types & Interfaces
import { EApiKeyPermission } from '@modules/users/enums';

interface IProps {
  label?: string;
  value: EApiKeyPermission;
  setValue: (value: EApiKeyPermission) => void;
  error?: boolean;
}

const SelectApiKeyPermission = (props: IProps) => {
  // ** Props
  const { label, value, setValue, error } = props;

  // ** Hooks
  const { t } = useTranslation();

  const handleStatusChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value as EApiKeyPermission);
    },
    [setValue]
  );

  return (
    <TextField
      error={error}
      select
      fullWidth
      value={value}
      label={label || t(`Permission Type`)}
      onChange={handleStatusChange}
      inputProps={{
        placeholder: label || t(`Permission Type`),
      }}
    >
      <MenuItem value={EApiKeyPermission.ANY}>{t(`All`)}</MenuItem>
      <MenuItem value={EApiKeyPermission.IS_CAN_SEND_SMS}>{t(`Can Send SMS`)}</MenuItem>
      <MenuItem value={EApiKeyPermission.IS_CAN_SMS_OUT}>{t(`Can Fetch Messages`)}</MenuItem>
      <MenuItem value={EApiKeyPermission.IS_CAN_GATEWAYS}>{t(`Can Manage SMSC`)}</MenuItem>
      <MenuItem value={EApiKeyPermission.IS_CAN_GATEWAY_LOGS}>{t(`Can Fetch SMSC-Logs`)}</MenuItem>
      <MenuItem value={EApiKeyPermission.IS_CAN_SEND_DLR}>{t(`Can Send DLR`)}</MenuItem>
      <MenuItem value={EApiKeyPermission.IS_CAN_SMS_IN}>{t(`Can Fetch Messages`)}</MenuItem>
      <MenuItem value={EApiKeyPermission.IS_CAN_CLIENTS}>{t(`Can Manage ESME`)}</MenuItem>
      <MenuItem value={EApiKeyPermission.IS_CAN_CLIENT_LOGS}>{t(`Can Fetch ESME-Logs`)}</MenuItem>
    </TextField>
  );
};

export default memo(SelectApiKeyPermission);
