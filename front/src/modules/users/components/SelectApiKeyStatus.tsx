// ** React Imports
import { ChangeEvent, memo, useCallback } from 'react';

// ** Hooks Imports
import { useTranslation } from 'react-i18next';

// ** Mui Imports
import { MenuItem, TextField } from '@mui/material';

// ** Types & Interfaces
import { EApiKeyStatus } from '@modules/users/enums';

interface IProps {
  label?: string;
  value: EApiKeyStatus;
  setValue: (value: EApiKeyStatus) => void;
  error?: boolean;
}

const SelectApiKeyStatus = (props: IProps) => {
  // ** Props
  const { label, value, setValue, error } = props;

  // ** Hooks
  const { t } = useTranslation();

  const handleStatusChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value as EApiKeyStatus);
    },
    [setValue]
  );

  return (
    <TextField
      error={error}
      select
      fullWidth
      value={value}
      label={label || t(`Status`)}
      onChange={handleStatusChange}
      inputProps={{
        placeholder: label || t(`Status`),
      }}
    >
      <MenuItem value={EApiKeyStatus.ANY}>{t(`All`)}</MenuItem>
      <MenuItem value={EApiKeyStatus.ACTIVE}>{t(`Active`)}</MenuItem>
      <MenuItem value={EApiKeyStatus.INACTIVE}>{t(`Inactive`)}</MenuItem>
    </TextField>
  );
};

export default memo(SelectApiKeyStatus);
