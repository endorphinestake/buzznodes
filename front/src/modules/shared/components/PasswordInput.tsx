// ** React Imports
import { memo, useState, MouseEvent, ChangeEvent, Fragment } from 'react';

// ** Mui Imports
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { EyeOffOutline, EyeOutline } from 'mdi-material-ui';
import { SyncLockOutlined } from '@mui/icons-material';

interface IProps {
  value: string;
  setValue: (value: string) => void;
  label?: string;
  error?: boolean;
  isGenerate?: boolean;
}

const PasswordInput = (props: IProps) => {
  // ** Props
  const { value, setValue, label, error, isGenerate } = props;

  // ** State
  const [isShow, setIsShow] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleClickGenerate = () => {
    setValue(Math.random().toString(36).slice(-8));
  };

  const handleClickShow = () => {
    setIsShow(!isShow);
  };

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <OutlinedInput
      label={label || 'Password'}
      value={value}
      onChange={handleChange}
      type={isShow ? 'text' : 'password'}
      error={error}
      autoComplete='new-password'
      endAdornment={
        <Fragment>
          {isGenerate ? (
            <InputAdornment position='end'>
              <IconButton
                edge='end'
                onClick={handleClickGenerate}
                onMouseDown={handleMouseDown}
                aria-label='generate password'
              >
                <SyncLockOutlined fontSize='small' />
              </IconButton>
            </InputAdornment>
          ) : null}
          <InputAdornment position='end'>
            <IconButton
              edge='end'
              onClick={handleClickShow}
              onMouseDown={handleMouseDown}
              aria-label='toggle password visibility'
            >
              {isShow ? (
                <EyeOutline fontSize='small' />
              ) : (
                <EyeOffOutline fontSize='small' />
              )}
            </IconButton>
          </InputAdornment>
        </Fragment>
      }
    />
  );
};

export default memo(PasswordInput);
