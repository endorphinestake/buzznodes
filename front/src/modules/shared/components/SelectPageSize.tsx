// ** React Imports
import { memo, useCallback } from 'react';
import { SelectChangeEvent } from '@mui/material';

// ** Mui Imports
import { MenuItem, Select, FormControl } from '@mui/material';

interface IProps {
  value: number;
  setValue: (value: number) => void;
}

const SelectPageSize = (props: IProps) => {
  // ** Props
  const { value, setValue } = props;

  const handleChange = useCallback(
    (e: SelectChangeEvent<number>) => {
      setValue(+e.target.value);
    },
    [setValue]
  );

  return (
    <FormControl variant='standard'>
      <Select displayEmpty value={value} onChange={handleChange}>
        <MenuItem value={25}>25</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
    </FormControl>
  );
};

export default memo(SelectPageSize);
