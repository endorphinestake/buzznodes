// ** React Imports
import { MouseEvent, memo, useState } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";

// ** Mui Imports
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// ** Types & Interfaces
import { EValidatorChartPeriod } from "@modules/blockchains/enums";

const ToggleChartPeriod = () => {
  // ** Hooks
  const { dispatch, period, setPeriod } = useBlockchainService();

  // ** State
  // const [alignment, setAlignment] = useState<EValidatorChartPeriod>(value);

  // ** Hooks
  const { t } = useTranslation();

  const handleAlignment = (
    event: MouseEvent<HTMLElement>,
    newAlignment: EValidatorChartPeriod
  ) => {
    // setAlignment(newAlignment);
    dispatch(setPeriod(newAlignment));
  };

  // const handleToggle = useCallback(
  //   (value: EBlockchainValidatorStatus) => {
  //     setValue(value);
  //   },
  //   [setValue]
  // );

  // const handleToggle = (
  //   event: MouseEvent<HTMLElement>,
  //   value: EValidatorChartPeriod
  // ) => {
  //   setValue(value);
  // };

  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      value={period}
      onChange={handleAlignment}
    >
      <ToggleButton value={EValidatorChartPeriod.H1}>
        {t(`1 hour`)}
      </ToggleButton>
      <ToggleButton value={EValidatorChartPeriod.H24}>
        {t(`1 day`)}
      </ToggleButton>
      <ToggleButton value={EValidatorChartPeriod.D7}>
        {t(`7 days`)}
      </ToggleButton>
      <ToggleButton value={EValidatorChartPeriod.D30}>
        {t(`1 month`)}
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default memo(ToggleChartPeriod);
