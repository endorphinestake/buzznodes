// ** React Imports
import { Fragment, useState } from "react";

// ** NextJS Imports
import Link from "next/link";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces Imports
import { TBlockchainValidatorDetail } from "@modules/blockchains/types";

// ** Shared Components Imports
import ManageAlertsDialog from "@modules/alerts/components/ManageAlertsDialog";

// ** MUI Imports
import { Grid, Typography } from "@mui/material";
import { BellPlus, BellCheck, ChartAreaspline } from "mdi-material-ui";
import CustomAvatar from "src/@core/components/mui/avatar";

const ValidatorButtons = ({
  validator,
}: {
  validator: TBlockchainValidatorDetail;
}) => {
  // ** Hooks
  const { t } = useTranslation();
  const { userAlertSettings } = useAlertService();

  // ** State
  const [isAlertSettingShow, setIsAlertSettingShow] = useState<boolean>(false);

  return (
    <Fragment>
      <Grid container>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <CustomAvatar skin="light" sx={{ mb: 3 }} variant="rounded">
            <Link href={`/charts?validator_id=${validator.id}`} passHref>
              <ChartAreaspline />
            </Link>
          </CustomAvatar>
          <Typography sx={{ mb: 0.5 }} variant="body2">
            {t(`Charts`)}
          </Typography>
        </Grid>

        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CustomAvatar
            skin="light"
            sx={{ mb: 3, cursor: "pointer" }}
            variant="rounded"
            onClick={() => setIsAlertSettingShow(true)}
          >
            {userAlertSettings[validator.id] ? <BellCheck /> : <BellPlus />}
          </CustomAvatar>
          <Typography sx={{ mb: 0.5 }} variant="body2">
            {t(`Alerts`)}
          </Typography>
        </Grid>
      </Grid>

      <ManageAlertsDialog
        open={isAlertSettingShow}
        setOpen={setIsAlertSettingShow}
        blockchainValidator={validator}
      />
    </Fragment>
  );
};

export default ValidatorButtons;
