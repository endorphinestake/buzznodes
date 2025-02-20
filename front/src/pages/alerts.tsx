// ** React Imports
import { ReactNode, useEffect, useState } from "react";

// ** NextJS Imports
import Head from "next/head";

// ** Configs
import { Permissions } from "@configs/acl";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useDomain } from "@context/DomainContext";
import { useAlertService } from "@hooks/useAlertService";
import { useBlockchainService } from "@hooks/useBlockchainService";

// ** Types & Interfaces
import { TAlertSettingsResponse } from "@modules/alerts/types";
import { EAlertType } from "@modules/alerts/enums";
import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";

// ** Layouts
import UserLayout from "@layouts/UserLayout";

// ** Shared Components
import styles from "@styles/Home.module.css";
import SelectAutorefresh from "@modules/shared/components/SelectAutorefresh";
import AlertsTable from "@modules/alerts/components/AlertsTable";

// ** MUI Imports
import { Box, Card, CardHeader, Grid, Typography } from "@mui/material";

const AlertsPage = () => {
  // ** Hooks
  const { t } = useTranslation();
  const { blockchainId } = useDomain();
  const {
    dispatch,
    fetchUserAlertSettings,
    isUserAlertSettingsLoaded,
    userAlertSettings,
  } = useAlertService();
  const {
    fetchBlockchainValidators,
    fetchBlockchainBridges,
    isBlockchainValidatorsLoaded,
    isBlockchainBridgesLoaded,
    blockchainBridges,
    blockchainValidators,
  } = useBlockchainService();

  // ** State
  const [isInit, setIsInit] = useState<boolean>(false);
  const [autorefresh, setAutorefresh] = useState<number>(10);
  const [alertType, setAlertType] = useState<EAlertType>(EAlertType.ANY);

  // OnInit
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);

      // Preload UserAlertSettings
      if (!isUserAlertSettingsLoaded) {
        dispatch(fetchUserAlertSettings());
      }

      // Preload blockchainValidators
      if (!isBlockchainValidatorsLoaded) {
        dispatch(
          fetchBlockchainValidators({
            blockchainId: blockchainId,
          })
        );
      }

      // Preload blockchainBridges
      if (!isBlockchainBridgesLoaded) {
        dispatch(
          fetchBlockchainBridges({
            blockchainId: blockchainId,
          })
        );
      }
    }
  }, []);

  var filteredUserAlertSettings = userAlertSettings;

  console.log("filteredUserAlertSettings: ", filteredUserAlertSettings);
  // console.log("blockchainBridges: ", blockchainBridges);
  // console.log("blockchainValidators: ", blockchainValidators);

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Manage Alerts`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t(`Manage Alerts`)} />
              <Box
                sx={{
                  p: 3,
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Grid container spacing={3}>
                  <Grid item sm={4} xs={12}>
                    filter 1
                  </Grid>

                  <Grid item sm={4} xs={12}>
                    filter 2
                  </Grid>

                  <Grid item sm={4} xs={12}>
                    filter 3
                  </Grid>
                </Grid>
              </Box>

              <AlertsTable alerts={filteredUserAlertSettings} />

              {!Object.keys(filteredUserAlertSettings).length ? (
                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mb: 4 }}
                >
                  <Typography
                    variant="body2"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {t(`No rows found`)}
                  </Typography>
                </Grid>
              ) : null}
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

AlertsPage.authGuard = true;
AlertsPage.acl = { action: "read", subject: Permissions.ANY };
AlertsPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

export default AlertsPage;
