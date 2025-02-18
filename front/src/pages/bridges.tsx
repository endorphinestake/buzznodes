// ** React Imports
import { ReactNode, useState, useEffect } from "react";

// ** Next Imports
import Head from "next/head";

// ** Configs
import { Permissions } from "@configs/acl";

// ** Hooks
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";
import { useAlertService } from "@hooks/useAlertService";
import { useDomain } from "@context/DomainContext";

// ** Types & Interfaces
import { TBlockchainBridge } from "@modules/blockchains/types";
import { EAlertType } from "@modules/alerts/enums";
import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";

// ** Layouts
import UserLayout from "@layouts/UserLayout";

// ** Shared Components
import styles from "@styles/Home.module.css";
import TextSearchOutline from "@modules/shared/components/TextSearchOutline";
import SelectValidatorStatus from "@modules/blockchains/components/SelectValidatorStatus";
import BridgesTable from "@modules/blockchains/components/BridgesTable";
import SelectAutorefresh from "@modules/shared/components/SelectAutorefresh";
import SelectAlertType from "@modules/alerts/components/SelectAlertType";

// ** Mui Imports
import { Grid, Card, Box, CardHeader, Typography, Button } from "@mui/material";

const BridgesPage = () => {
  // ** Hooks
  const { t } = useTranslation();
  const { blockchainId, isDaEnabled } = useDomain();
  const { dispatch, fetchBlockchainBridges, blockchainBridges } =
    useBlockchainService();
  const {
    fetchAlertSettings,
    fetchUserAlertSettings,
    isAlertSettingsLoaded,
    isUserAlertSettingsLoaded,
  } = useAlertService();

  // ** State
  const [isInit, setIsInit] = useState<boolean>(false);
  const [autorefresh, setAutorefresh] = useState<number>(10);
  const [bridgeStatus, setBridgeStatus] = useState<EBlockchainValidatorStatus>(
    EBlockchainValidatorStatus.BOND_STATUS_BONDED
  );
  const [alertType, setAlertType] = useState<EAlertType>(EAlertType.ANY);
  const [search, setSearch] = useState<string>("");

  // Event onInit
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      // Preload bridges
      dispatch(
        fetchBlockchainBridges({
          blockchainId: blockchainId,
          status:
            bridgeStatus === EBlockchainValidatorStatus.BOND_STATUS_BONDED,
        })
      );

      // Preload AlertSettings
      if (!isAlertSettingsLoaded) {
        dispatch(fetchAlertSettings());
      }

      // Preload UserAlertSettings
      if (!isUserAlertSettingsLoaded) {
        dispatch(fetchUserAlertSettings());
      }
    }
  }, []);

  // Event on Autorefresh changed
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (autorefresh > 0) {
      interval = setInterval(() => {
        dispatch(
          fetchBlockchainBridges({
            blockchainId: blockchainId,
            status:
              bridgeStatus === EBlockchainValidatorStatus.BOND_STATUS_BONDED,
          })
        );
      }, autorefresh * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autorefresh, bridgeStatus]);

  // Refresh when status changed
  useEffect(() => {
    dispatch(
      fetchBlockchainBridges({
        blockchainId: blockchainId,
        status: bridgeStatus === EBlockchainValidatorStatus.BOND_STATUS_BONDED,
      })
    );
  }, [bridgeStatus]);

  var filteredBridges: TBlockchainBridge[] = blockchainBridges;

  // filter by Status
  // if (filteredBridges.length > 0) {
  //   filteredBridges = filteredBridges.filter((item) => {
  //     switch (bridgeStatus) {
  //       case EBlockchainValidatorStatus.BOND_STATUS_BONDED:
  //         return item.status === EBlockchainValidatorStatus.BOND_STATUS_BONDED;
  //       case EBlockchainValidatorStatus.BOND_STATUS_UNBONDED:
  //         return item.status !== EBlockchainValidatorStatus.BOND_STATUS_BONDED;
  //     }
  //   });
  // }

  // filter by Search
  if (search.length > 0) {
    filteredBridges = filteredBridges.filter((item) => {
      return (item.node_id ?? "").toLowerCase().includes(search.toLowerCase());
    });
  }

  // Event on DA is disabled
  if (!isDaEnabled) {
    const router = useRouter();
    useEffect(() => {
      router.replace("/404");
    }, []);
    return null;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Bridges`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={t(`Bridges`)}
                subheader={t(`Blockchain Monitoring`)}
              />
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
                    <SelectValidatorStatus
                      value={bridgeStatus}
                      setValue={setBridgeStatus}
                      label={t(`Status`)}
                    />
                  </Grid>

                  {/* <Grid item sm={4} xs={12}>
                    <SelectAlertType
                      value={alertType}
                      setValue={setAlertType}
                      label={t(`With alerts enabled`)}
                    />
                  </Grid> */}

                  <Grid item sm={8} xs={12}>
                    <TextSearchOutline
                      setValue={setSearch}
                      placeholder={t(`Bridge ID`)}
                    />
                  </Grid>
                </Grid>
              </Box>

              <BridgesTable bridges={filteredBridges} />

              {!filteredBridges.length ? (
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
              ) : (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={10} display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ ml: 4 }}>
                      {t(`Total`)}: {filteredBridges.length}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{ pr: 4 }}
                    display="flex"
                    justifyContent="right"
                    alignItems="center"
                  >
                    <SelectAutorefresh
                      value={autorefresh}
                      setValue={setAutorefresh}
                    />
                  </Grid>
                </Grid>
              )}
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

BridgesPage.authGuard = true;
BridgesPage.acl = { action: "read", subject: Permissions.ANY };
BridgesPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

export default BridgesPage;
