// ** React Imports
import { memo, useCallback } from "react";
import { SelectChangeEvent } from "@mui/material";

// ** Hooks
import { useTranslation } from "react-i18next";

// ** Mui Imports
import { Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

interface IProps {
  value: number;
  setValue: (value: number) => void;
}

const SelectAutorefresh = (props: IProps) => {
  // ** Props
  const { value, setValue } = props;

  // ** Hooks
  const { t } = useTranslation();

  const handleChange = useCallback(
    (e: SelectChangeEvent<number>) => {
      setValue(+e.target.value);
    },
    [setValue]
  );

  return (
    <Box display="flex" alignItems="center">
      <Box mr={3}>
        <InputLabel>{t(`Autorefresh`)}:</InputLabel>
      </Box>
      <FormControl variant="standard">
        <Select value={value} onChange={handleChange} displayEmpty>
          <MenuItem value={0}>---</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default memo(SelectAutorefresh);
