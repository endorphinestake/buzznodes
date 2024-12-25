// ** React Imports
import { memo, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { IconButton, TextField } from '@mui/material';
import useDebounce from '@hooks/useDebounce';
import { Close, Magnify } from 'mdi-material-ui';

interface IProps {
  value: string;
  setValue: (value: string) => void;
  delay?: number;
  label?: string;
  size?: 'small' | 'medium';
}

const TextSearch = (props: IProps) => {
  const { value, setValue, delay, label, size } = props;

  // ** State
  const [search, setSearch] = useState<string>('');

  // ** Hooks
  const debouncedValue = useDebounce<string>(search, delay);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  // Fetch API (optional)
  useEffect(() => {
    setValue(search);
  }, [debouncedValue]);

  return (
    // <TextField
    //   fullWidth
    //   size={size || 'medium'}
    //   value={search}
    //   sx={{ mr: 6, mb: 2 }}
    //   placeholder={label || 'Search'}
    //   onChange={handleSearchChange}
    // />

    <TextField
      variant='standard'
      value={search}
      onChange={handleSearchChange}
      placeholder={label || 'Search…'}
      InputProps={{
        startAdornment: <Magnify fontSize={size || 'medium'} />,
        endAdornment: (
          <IconButton
            size={size || 'medium'}
            title='Clear'
            aria-label='Clear'
            onClick={handleClearSearch}
          >
            <Close fontSize={size || 'medium'} />
          </IconButton>
        ),
      }}
      sx={{
        width: {
          xs: 1,
          sm: 'auto',
        },
        m: (theme) => theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          mr: 0.5,
        },
        '& .MuiInput-underline:before': {
          borderBottom: 1,
          borderColor: 'divider',
        },
      }}
    />
  );
};

export default memo(TextSearch);
