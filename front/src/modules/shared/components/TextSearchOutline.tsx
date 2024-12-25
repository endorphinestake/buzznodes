// ** React Imports
import { memo, useState, useEffect, useCallback, ChangeEvent } from 'react';

// ** Hooks Imports
import useDebounce from '@hooks/useDebounce';
import { useTranslation } from 'react-i18next';

// ** MUI Imports
import { IconButton, TextField } from '@mui/material';
import { Close, Magnify } from 'mdi-material-ui';


interface IProps {
  setValue: (value: string) => void;
  delay?: number;
  label?: string;
  placeholder?: string;
}

const TextSearchOutline = (props: IProps) => {
  const { setValue, delay, label, placeholder } = props;

  // ** State
  const [search, setSearch] = useState<string>('');

  // ** Hooks
  const { t } = useTranslation();
  const debouncedValue = useDebounce<string>(search, delay);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // Fetch API (optional)
  useEffect(() => {
    setValue(search);
  }, [debouncedValue]);

  return (
    <TextField
      fullWidth
      label={label || t(`Search`)}
      value={search}
      placeholder={placeholder || t(`Search`)}
      onChange={handleSearchChange}
    />
  );
};

export default memo(TextSearchOutline);
