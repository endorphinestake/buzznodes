// ** React Imports
import { memo } from "react";

// ** Mui Imports
import { MenuItem, TextField } from "@mui/material";

interface IProps {
  label?: string;
}

const SelectExample = (props: IProps) => {
  // ** Props
  const { label } = props;

  return (
    <TextField
      select
      fullWidth
      label={label || "example select"}
      inputProps={{
        placeholder: label || "example select",
      }}
    >
      <MenuItem value={"test"}>-----</MenuItem>
    </TextField>
  );
};

export default memo(SelectExample);
