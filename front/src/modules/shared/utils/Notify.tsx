// ** React imports
import { ReactElement } from 'react';

// ** Third Party Components
import toast from 'react-hot-toast';

// ** Mui Imports
import { Alert, AlertTitle } from '@mui/material';

const Notify = (
  type: 'info' | 'success' | 'warning' | 'error',
  message: string | ReactElement,
  position?: 'top-center' | 'bottom-left'
) => {
  switch (type) {
    case 'info':
      return toast(
        (t) => (
          <Alert severity='info'>
            <AlertTitle>Info</AlertTitle>
            {message}
          </Alert>
        ),
        {
          position: position || 'top-center',
        }
      );
    case 'success':
      return toast(
        (t) => (
          <Alert variant='outlined' severity='success'>
            <AlertTitle>Success</AlertTitle>
            {message}
          </Alert>
        ),
        {
          position: position || 'top-center',
        }
      );
    case 'warning':
      return toast(
        (t) => (
          <Alert severity='warning'>
            <AlertTitle>Warning</AlertTitle>
            {message}
          </Alert>
        ),
        {
          position: position || 'top-center',
        }
      );
    case 'error':
      return toast(
        (t) => (
          <Alert severity='error'>
            <AlertTitle>Error</AlertTitle>
            {message}
          </Alert>
        ),
        {
          position: position || 'top-center',
        }
      );
  }
};

export default Notify;
