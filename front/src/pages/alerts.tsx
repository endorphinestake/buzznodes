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
import { EAlertType } from "@modules/alerts/enums";
import {
  EBlockchainValidatorStatus,
  EBlockchainValidatorType,
} from "@modules/blockchains/enums";

// ** Layouts
import UserLayout from "@layouts/UserLayout";

// ** Shared Components
import styles from "@styles/Home.module.css";
import AlertsTable from "@modules/alerts/components/AlertsTable";
import SelectValidatorType from "@modules/blockchains/components/SelectValidatorType";
import SelectValidatorStatus from "@modules/blockchains/components/SelectValidatorStatus";
import SelectAlertType from "@modules/alerts/components/SelectAlertType";
import TextSearchOutline from "@modules/shared/components/TextSearchOutline";

// ** MUI Imports
import { Box, Card, CardHeader, Grid, Typography } from "@mui/material";

const AlertsPage = () => {
  // ** Hooks
  const { t } = useTranslation();
  const { blockchainId } = useDomain();
  const {
    dispatch,
    fetchAlertSettings,
    fetchUserAlertSettings,
    isAlertSettingsLoaded,
    isUserAlertSettingsLoaded,
    alertSettings,
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
  const [validatorType, setValidatorType] = useState<EBlockchainValidatorType>(
    EBlockchainValidatorType.ANY
  );
  const [validatorStatus, setValidatorStatus] =
    useState<EBlockchainValidatorStatus>(EBlockchainValidatorStatus.ANY);

  const [alertType, setAlertType] = useState<EAlertType>(EAlertType.ANY);
  const [search, setSearch] = useState<string>("");

  // OnInit
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);

      // Preload AlertSettings
      if (!isAlertSettingsLoaded) {
        dispatch(fetchAlertSettings());
      }

      // Preload UserAlertSettings
      if (!isUserAlertSettingsLoaded) {
        dispatch(fetchUserAlertSettings({ blockchainId: blockchainId }));
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

  // Filter by validatorType
  if (validatorType !== EBlockchainValidatorType.ANY) {
    filteredUserAlertSettings = Object.fromEntries(
      Object.entries(filteredUserAlertSettings).filter(([key, value]) => {
        const hasOtelUpdate = value.OTEL_UPDATE && value.OTEL_UPDATE.length > 0;
        const hasSyncStatus = value.SYNC_STATUS && value.SYNC_STATUS.length > 0;

        switch (validatorType) {
          case EBlockchainValidatorType.VALIDATOR:
            return !hasOtelUpdate && !hasSyncStatus;
          case EBlockchainValidatorType.BRIDGE:
            return hasOtelUpdate || hasSyncStatus;
          default:
            return true;
        }
      })
    );
  }

  // Filter by Status
  if (validatorStatus !== EBlockchainValidatorStatus.ANY) {
    filteredUserAlertSettings = Object.fromEntries(
      Object.entries(filteredUserAlertSettings).filter(([key, value]) => {
        const hasOtelUpdate = value.OTEL_UPDATE && value.OTEL_UPDATE.length > 0;
        const hasSyncStatus = value.SYNC_STATUS && value.SYNC_STATUS.length > 0;

        if (hasOtelUpdate || hasSyncStatus) {
          const bridge = blockchainBridges.bridges.find(
            (item) => item.id === +key
          );
          if (!bridge) return false;
          if (
            validatorStatus === EBlockchainValidatorStatus.BOND_STATUS_BONDED
          ) {
            return bridge.last_timestamp_diff < 36000;
          } else {
            return bridge.last_timestamp_diff > 36000;
          }
        } else {
          const validator = blockchainValidators.validators.find(
            (item) => item.id === +key
          );
          if (!validator) return false;
          if (
            validatorStatus === EBlockchainValidatorStatus.BOND_STATUS_BONDED
          ) {
            return (
              validator.status === EBlockchainValidatorStatus.BOND_STATUS_BONDED
            );
          } else {
            return (
              validator.status !== EBlockchainValidatorStatus.BOND_STATUS_BONDED
            );
          }
        }
      })
    );
  }

  // filter by AlertType
  if (alertType !== EAlertType.ANY) {
    filteredUserAlertSettings = Object.fromEntries(
      Object.entries(filteredUserAlertSettings).filter(([key, value]) => {
        return value[alertType]?.length || false;
      })
    );
  }

  // filter by Search
  if (search.length > 0) {
    filteredUserAlertSettings = Object.fromEntries(
      Object.entries(filteredUserAlertSettings).filter(([key, value]) => {
        const hasOtelUpdate = value.OTEL_UPDATE && value.OTEL_UPDATE.length > 0;
        const hasSyncStatus = value.SYNC_STATUS && value.SYNC_STATUS.length > 0;

        if (hasOtelUpdate || hasSyncStatus) {
          const bridge = blockchainBridges.bridges.find(
            (item) => item.id === +key
          );

          if (hasOtelUpdate) {
            return (value.OTEL_UPDATE?.[0]?.moniker ?? "")
              .toLowerCase()
              .includes(search.toLowerCase());
          } else {
            return (value.SYNC_STATUS?.[0]?.moniker ?? "")
              .toLowerCase()
              .includes(search.toLowerCase());
          }
        } else {
          const validator = blockchainValidators.validators.find(
            (item) => item.id === +key
          );

          return (validator?.moniker ?? "")
            .toLowerCase()
            .includes(search.toLowerCase());
        }
      })
    );
  }

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
                  <Grid item sm={3} xs={12}>
                    <SelectValidatorType
                      value={validatorType}
                      setValue={setValidatorType}
                      label={t(`Type`)}
                    />
                  </Grid>

                  <Grid item sm={3} xs={12}>
                    <SelectValidatorStatus
                      value={validatorStatus}
                      setValue={setValidatorStatus}
                      label={t(`Validator Status`)}
                    />
                  </Grid>

                  <Grid item sm={3} xs={12}>
                    <SelectAlertType
                      value={alertType}
                      setValue={setAlertType}
                      label={t(`With alerts enabled`)}
                    />
                  </Grid>

                  <Grid item sm={3} xs={12}>
                    <TextSearchOutline
                      setValue={setSearch}
                      placeholder={t(`Moniker`)}
                    />
                  </Grid>
                </Grid>
              </Box>

              <AlertsTable
                alertSettings={alertSettings}
                userAlertSettings={filteredUserAlertSettings}
                validators={blockchainValidators.validators}
                bridges={blockchainBridges.bridges}
              />

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
