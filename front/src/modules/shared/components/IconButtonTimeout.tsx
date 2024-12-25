// ** React Imports
import { useState, ReactElement } from 'react';

// ** MUI Imports
import { IconButton, Tooltip } from '@mui/material';

const IconButtonTimeout = (props: {
  handleClick: Function;
  icon: ReactElement;
  tooltip?: string;
}) => {
  // ** Props
  const { handleClick, icon, tooltip } = props;

  // ** State
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleButtonClick = () => {
    setIsDisabled(true);

    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);

    handleClick();
  };

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <IconButton
          size='small'
          color='primary'
          onClick={handleButtonClick}
          disabled={isDisabled}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  } else {
    return (
      <IconButton
        size='small'
        color='primary'
        onClick={handleButtonClick}
        disabled={isDisabled}
      >
        {icon}
      </IconButton>
    );
  }
};

export default IconButtonTimeout;
