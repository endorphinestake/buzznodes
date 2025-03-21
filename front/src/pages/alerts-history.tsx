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
import AlertsHistoryTable from "@modules/alerts/components/AlertsHistoryTable";
import SelectValidatorType from "@modules/blockchains/components/SelectValidatorType";
import SelectValidatorStatus from "@modules/blockchains/components/SelectValidatorStatus";
import TextSearchOutline from "@modules/shared/components/TextSearchOutline";

// ** MUI Imports
import { Box, Card, CardHeader, Grid, Typography } from "@mui/material";

const AlertsHistoryPage = () => {
  // ** Hooks
  const { t } = useTranslation();
  const { blockchainId } = useDomain();
  const {
    dispatch,
    fetchAlertHistory,
    isAlertHistoryLoading,
    isAlertHistoryLoaded,
    isAlertHistoryError,
    alertHistory,
  } = useAlertService();

  // ** State
  const [isInit, setIsInit] = useState<boolean>(false);
  const [validatorType, setValidatorType] = useState<EBlockchainValidatorType>(
    EBlockchainValidatorType.ANY
  );
  const [validatorStatus, setValidatorStatus] =
    useState<EBlockchainValidatorStatus>(EBlockchainValidatorStatus.ANY);
  const [search, setSearch] = useState<string>("");

  // OnInit
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);

      // Preload AlertHistory
      if (!isAlertHistoryLoaded) {
        dispatch(fetchAlertHistory({ blockchainId: blockchainId }));
      }
    }
  }, []);

  var filteredAlertHistory = alertHistory;

  // Filter by validatorType
  if (validatorType !== EBlockchainValidatorType.ANY) {
    filteredAlertHistory = filteredAlertHistory.filter((item) => {
      switch (validatorType) {
        case EBlockchainValidatorType.VALIDATOR:
          return item.validator;
        case EBlockchainValidatorType.BRIDGE:
          return item.bridge;
        default:
          return true;
      }
    });
  }

  // Filter by Status
  if (validatorStatus !== EBlockchainValidatorStatus.ANY) {
    filteredAlertHistory = filteredAlertHistory.filter((item) => {
      // Active
      if (validatorStatus === EBlockchainValidatorStatus.BOND_STATUS_BONDED) {
        if (item.validator) {
          return (
            item.validator.status ===
            EBlockchainValidatorStatus.BOND_STATUS_BONDED
          );
        } else if (item.bridge) {
          return item.bridge.last_timestamp_diff < 36000;
        }
        // Inactive
      } else {
        if (item.validator) {
          return (
            item.validator.status !==
            EBlockchainValidatorStatus.BOND_STATUS_BONDED
          );
        } else if (item.bridge) {
          return item.bridge.last_timestamp_diff > 36000;
        }
      }
    });
  }

  // filter by Search
  if (validatorType !== EBlockchainValidatorType.ANY) {
    filteredAlertHistory = filteredAlertHistory.filter((item) => {
      if (item.validator) {
        return (item.validator.moniker ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());
      } else if (item.bridge) {
      }
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Alerts History`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t(`Alerts History`)} />
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
                    <SelectValidatorType
                      value={validatorType}
                      setValue={setValidatorType}
                      label={t(`Type`)}
                    />
                  </Grid>

                  <Grid item sm={4} xs={12}>
                    <SelectValidatorStatus
                      value={validatorStatus}
                      setValue={setValidatorStatus}
                      label={t(`Status`)}
                    />
                  </Grid>

                  <Grid item sm={4} xs={12}>
                    <TextSearchOutline
                      setValue={setSearch}
                      placeholder={t(`Moniker`)}
                    />
                  </Grid>
                </Grid>
              </Box>

              <AlertsHistoryTable histories={filteredAlertHistory} />

              {!filteredAlertHistory.length ? (
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

AlertsHistoryPage.authGuard = true;
AlertsHistoryPage.acl = { action: "read", subject: Permissions.ANY };
AlertsHistoryPage.getLayout = (page: ReactNode) => (
  <UserLayout>{page}</UserLayout>
);

export default AlertsHistoryPage;
