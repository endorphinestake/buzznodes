// ** React Imports
import {
  memo,
  useState,
  useEffect,
  useCallback,
  Fragment,
  SyntheticEvent,
} from "react";

// ** Hooks
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";

// ** Shared Components
import Notify from "@modules/shared/utils/Notify";

// ** Types & Interfaces
import { ISelectValidatorsProps } from "@modules/blockchains/interfaces";
import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";

// ** Mui Imports
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Chip,
} from "@mui/material";
import { FlashOutline, FlashOffOutline } from "mdi-material-ui";

const SelectValidators = (props: ISelectValidatorsProps) => {
  // ** Props
  const { value, values, setValue, setValues, label, size } = props;

  // ** Hooks
  const { t } = useTranslation();
  const {
    dispatch,
    fetchBlockchainValidators,
    isBlockchainValidatorsLoading,
    blockchainValidators,
  } = useBlockchainService();

  // ** State
  const [isInit, setIsInit] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  // ** Vars
  const isMultiple = typeof setValues !== "undefined";
  const MAX_SELECTABLE_VALIDATORS = 5;

  // Event onInit
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      dispatch(fetchBlockchainValidators());
    }
  }, []);

  const handleChange = useCallback(
    (event: SyntheticEvent, value: any) => {
      if (isMultiple) {
        if (value.length <= MAX_SELECTABLE_VALIDATORS) {
          setValues(value);
        } else {
          Notify(
            "info",
            t(
              `A maximum of ${MAX_SELECTABLE_VALIDATORS} validators can be selected`
            )
          );
        }
      } else if (setValue) {
        setValue(value);
      }
    },
    [isMultiple, setValues, setValue]
  );

  return (
    <Autocomplete
      disablePortal
      fullWidth
      multiple={isMultiple}
      disableClearable={!isMultiple}
      value={isMultiple ? values || [] : value || null}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleChange}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.moniker ?? "Unknown"}
      options={blockchainValidators}
      loading={isBlockchainValidatorsLoading}
      renderOption={(params, option) => (
        <Box
          {...params}
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          key={option.id}
        >
          {option.status === EBlockchainValidatorStatus.BOND_STATUS_BONDED ? (
            <FlashOutline style={{ color: "green", marginRight: 8 }} />
          ) : (
            <FlashOffOutline style={{ color: "red", marginRight: 8 }} />
          )}
          {option.moniker ?? "Unknown"}{" "}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || t(`Select Validator`)}
          size={size || "medium"}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {isBlockchainValidatorsLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.moniker ?? "Unknown"}
            {...getTagProps({ index })}
            key={option.id}
          />
        ))
      }
    />
  );
};

export default memo(SelectValidators);
