// ** React Imports
import { useState, forwardRef, memo } from 'react';

// ** Third Party Imports
import format from 'date-fns/format';
import DatePicker from 'react-datepicker';
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// ** Hooks
import { useTranslation } from 'react-i18next';

// ** MUI Imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

// ** Types
import { DateType } from '@modules/shared/types';


// ** Styles
import 'react-datepicker/dist/react-datepicker.css';


interface IPickerProps {
  start: Date | number;
  end: Date | number;
}

interface IProps {
  label?: string;
  startDate: DateType;
  setStartDate: (value: DateType) => void;
  endDate: DateType;
  setEndDate: (value: DateType) => void;
  minDate: DateType;
  maxDate: DateType;
}

const SelectDateRange = (props: IProps) => {
  // ** Props
  const { label, startDate, setStartDate, endDate, setEndDate, minDate, maxDate } = props;

  // ** Hooks
  const { t } = useTranslation();

  const handleOnChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  }

  const CustomInput = forwardRef((props: IPickerProps, ref) => {
    const start = format(props.start || startDate!, 'dd/MM/yyyy');
    const end = ` - ${format(props.end || endDate!, 'dd/MM/yyyy')}`;

    const value = `${start}${end}`;

    return <TextField inputRef={ref} label={label || t(`Select Date`)} {...props} value={value} fullWidth />
  });

  return (
    <DatePicker
      selectsRange
      monthsShown={2}
      minDate={minDate}
      maxDate={maxDate}
      endDate={endDate}
      selected={startDate}
      startDate={startDate}
      shouldCloseOnSelect={true}
      id='date-range-picker'
      onChange={handleOnChange}
      customInput={
        <CustomInput
          start={startDate || new Date() as Date | number}
          end={endDate || new Date() as Date | number}
        />
      }
      popperPlacement='bottom-start'
    />
  );
}

export default memo(SelectDateRange);
