// ** React Imports
import { ChangeEvent, memo, useCallback } from 'react';

// ** Hooks Imports
import { useTranslation } from 'react-i18next';

// ** Mui Imports
import { MenuItem, TextField } from '@mui/material';

// ** Types & Interfaces
import { EEnabled } from '@modules/gateways/enums';

interface IProps {
  label?: string;
  value: EEnabled;
  setValue: (value: EEnabled) => void;
  error?: boolean;
}

const SelectEnabled = (props: IProps) => {
  // ** Props
  const { label, value, setValue, error } = props;

  // ** Hooks
  const { t } = useTranslation();

  const handleStatusChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value as EEnabled);
    },
    [setValue]
  );

  return (
    <TextField
      error={error}
      select
      fullWidth
      value={value}
      label={label || t(`Enabled`)}
      onChange={handleStatusChange}
      inputProps={{
        placeholder: label || t(`Enabled`),
      }}
    >
      <MenuItem value={EEnabled.ANY}>{t(`All`)}</MenuItem>
      <MenuItem value={EEnabled.ENABLED}>{t('Enabled')}</MenuItem>
      <MenuItem value={EEnabled.DISABLED}>{t('Disabled')}</MenuItem>
    </TextField>
  );
};

export default memo(SelectEnabled);
