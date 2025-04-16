// ** React Imports
import { ReactNode, useState, useEffect } from "react";

// ** Next Imports
import Head from "next/head";

// ** Configs
import { Permissions } from "@configs/acl";

// ** Hooks
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";
import { useAlertService } from "@hooks/useAlertService";
import { useDomain } from "@context/DomainContext";

// ** Types & Interfaces
import { TBlockchainValidator } from "@modules/blockchains/types";
import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";

// ** Layouts
import UserLayout from "@layouts/UserLayout";

// ** Shared Components
import styles from "@styles/Home.module.css";
import TextSearchOutline from "@modules/shared/components/TextSearchOutline";
import SelectValidatorStatus from "@modules/blockchains/components/SelectValidatorStatus";
import ValidatorsTable from "@modules/blockchains/components/ValidatorsTable";
import SelectAutorefresh from "@modules/shared/components/SelectAutorefresh";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

// ** Mui Imports
import { Grid, Card, Box, CardHeader, Typography } from "@mui/material";

const HomePage = () => {
  // ** Hooks
  const { t } = useTranslation();
  const { blockchainId } = useDomain();
  const { dispatch, fetchBlockchainValidators, blockchainValidators } =
    useBlockchainService();
  const {
    fetchAlertSettings,
    fetchUserAlertSettings,
    isAlertSettingsLoaded,
    isUserAlertSettingsLoaded,
    userAlertSettings,
  } = useAlertService();

  // ** State
  const [isInit, setIsInit] = useState<boolean>(false);
  const [autorefresh, setAutorefresh] = useState<number>(10);
  const [validatorStatus, setValidatorStatus] =
    useState<EBlockchainValidatorStatus>(
      EBlockchainValidatorStatus.BOND_STATUS_BONDED
    );
  const [search, setSearch] = useState<string>("");

  // Event onInit
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      // Preload blockchains
      dispatch(
        fetchBlockchainValidators({
          blockchainId: blockchainId,
          status: validatorStatus,
        })
      );

      // Preload AlertSettings
      if (!isAlertSettingsLoaded) {
        dispatch(fetchAlertSettings());
      }

      // Preload UserAlertSettings
      if (!isUserAlertSettingsLoaded) {
        dispatch(fetchUserAlertSettings({ blockchainId: blockchainId }));
      }
    }
  }, []);

  // Event on Autorefresh changed
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (autorefresh > 0) {
      interval = setInterval(() => {
        dispatch(
          fetchBlockchainValidators({
            blockchainId: blockchainId,
            status: validatorStatus,
          })
        );
      }, autorefresh * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autorefresh, validatorStatus]);

  // Refresh when status changed
  useEffect(() => {
    dispatch(
      fetchBlockchainValidators({
        blockchainId: blockchainId,
        status: validatorStatus,
      })
    );
  }, [validatorStatus]);

  var filteredValidators: TBlockchainValidator[] =
    blockchainValidators.validators;

  // filter by Status
  if (blockchainValidators.validators.length > 0) {
    filteredValidators = filteredValidators.filter((item) => {
      switch (validatorStatus) {
        case EBlockchainValidatorStatus.BOND_STATUS_BONDED:
          return item.status === EBlockchainValidatorStatus.BOND_STATUS_BONDED;
        case EBlockchainValidatorStatus.BOND_STATUS_UNBONDED:
          return item.status !== EBlockchainValidatorStatus.BOND_STATUS_BONDED;
      }
    });
  }

  // filter by Search
  if (search.length > 0) {
    filteredValidators = filteredValidators.filter((item) => {
      return (
        (item.moniker ?? "").toLowerCase().includes(search.toLowerCase()) ||
        item.operator_address.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Validators`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={t(`Validators`)}
                subheader={t(`Network Height: {{height}}`, {
                  height: Intl.NumberFormat("ru-RU").format(
                    blockchainValidators.network_height
                  ),
                })}
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
                      value={validatorStatus}
                      setValue={setValidatorStatus}
                      label={t(`Status`)}
                    />
                  </Grid>

                  <Grid item sm={8} xs={12}>
                    <TextSearchOutline
                      setValue={setSearch}
                      placeholder={t(`Moniker / Valoper`)}
                    />
                  </Grid>
                </Grid>
              </Box>

              <ValidatorsTable
                validators={filteredValidators}
                status={validatorStatus}
                onAlertEdit={() => console.log("onAlertEdit triggered")}
              />

              {!filteredValidators.length ? (
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
                      {t(`Total`)}: {filteredValidators.length}
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

        {process.env.DEBUG === "false" ? (
          <TawkMessengerReact
            propertyId={process.env.TAWK_PROPERY_ID || ""}
            widgetId={process.env.TAWK_WIDGET_ID || ""}
          />
        ) : null}
      </main>
    </div>
  );
};

HomePage.bothGuard = true;
HomePage.acl = { action: "read", subject: Permissions.ANY };
HomePage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

export default HomePage;
