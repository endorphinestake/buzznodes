// ** React Imports
import { ReactNode, useState, useEffect, useMemo } from "react";

// ** NextJS Imports
import Head from "next/head";

// ** Configs
import { Permissions } from "@configs/acl";

// ** Hooks Imports
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";

// ** Layouts
import UserLayout from "@layouts/UserLayout";

// ** Shared Components
import styles from "@styles/Home.module.css";
import SelectValidators from "@modules/blockchains/components/SelectValidators";
import ValidatorsChart from "@modules/blockchains/components/ValidatorsChart";
import { generateLightBlueColor } from "@modules/shared/utils/colors";
import ToggleChartPeriod from "@modules/blockchains/components/ToggleChartPeriod";

// ** Types & Interfaces Imports
import { TBlockchainValidator } from "@modules/blockchains/types";
import {
  EValidatorChartType,
  EValidatorChartPeriod,
} from "@modules/blockchains/enums";

// ** MUI Imports
import { Box, Card, CardHeader, Grid, CircularProgress } from "@mui/material";

const ChartsPage = () => {
  // ** Hooks
  const { t } = useTranslation();
  const router = useRouter();
  // ** Hooks
  const {
    dispatch,
    fetchValidatorCharts,
    isBlockchainValidatorsLoading,
    blockchainValidators,
    // isValidatorChartsLoading,
    // isValidatorChartsLoaded,
    // isValidatorChartsError,
    validatorCharts,
    period,
  } = useBlockchainService();

  // ** State
  const [validator, setValidator] = useState<TBlockchainValidator>();
  const [validators, setValidators] = useState<TBlockchainValidator[]>([]);

  // ** Vars
  const validatorMonikersWithColors = useMemo(() => {
    return blockchainValidators.validators.reduce((acc, validator, index) => {
      acc[validator.id] = {
        moniker: validator.moniker ?? "Unknown",
        color: generateLightBlueColor(index),
      };
      return acc;
    }, {} as Record<string, { moniker: string; color: string }>);
  }, [blockchainValidators]);

  // Autoselect Validator from URL
  useEffect(() => {
    const { validator_id } = router.query;

    if (validator_id && !isBlockchainValidatorsLoading) {
      const selectedValidator = blockchainValidators.validators.find(
        (validator) => validator.id === +validator_id
      );
      if (selectedValidator) {
        setValidator(selectedValidator);
        // setValidators([selectedValidator]);
      }
    }
  }, [router.query, blockchainValidators, isBlockchainValidatorsLoading]);

  // Event on Validator(s) or period selected
  useEffect(() => {
    if (validators.length) {
      const validatorIds = validators.map((validator) => validator.id);
      dispatch(
        fetchValidatorCharts({ validator_ids: validatorIds, period: period })
      );
    }
    if (validator) {
      dispatch(
        fetchValidatorCharts({ validator_ids: [validator.id], period: period })
      );
    }
  }, [validator, validators, period]);

  // Check if the monikers are ready before using them
  const isMonikersLoaded = !!Object.keys(validatorMonikersWithColors).length;

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Charts`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={t(`Charts`)}
                subheader={t(`Uptime, Сommission and Voting Power charts`)}
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
                  <Grid item sm={8} xs={12}>
                    <SelectValidators
                      value={validator}
                      setValue={setValidator}
                      // values={validators}
                      // setValues={setValidators}
                      label={t("Select Validator")}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12} sx={{ mt: 1 }}>
                    <ToggleChartPeriod />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>

          {/* Voting Power Chart */}
          <Grid item xs={12}>
            {isMonikersLoaded &&
            validatorCharts &&
            validatorCharts[EValidatorChartType.COSMOS_VOTING_POWER] ? (
              <ValidatorsChart
                chartTitle={t(`Voting Power`)}
                data={validatorCharts[EValidatorChartType.COSMOS_VOTING_POWER]}
                monikers={validatorMonikersWithColors}
                tickFormat={(value: any, index: number) =>
                  `${Intl.NumberFormat("ru-RU").format(value)}`
                }
              />
            ) : null}
          </Grid>

          {/* Uptime Chart */}
          <Grid item xs={12}>
            {isMonikersLoaded &&
            validatorCharts &&
            validatorCharts[EValidatorChartType.COSMOS_UPTIME] ? (
              <ValidatorsChart
                chartTitle={t(`Uptime`)}
                data={validatorCharts[EValidatorChartType.COSMOS_UPTIME]}
                monikers={validatorMonikersWithColors}
                dataMin={0}
                dataMax={100}
                tickFormat={(value: any, index: number) => `${value}%`}
              />
            ) : null}
          </Grid>

          {/* Comission Chart */}
          <Grid item xs={12}>
            {isMonikersLoaded &&
            validatorCharts &&
            validatorCharts[EValidatorChartType.COSMOS_COMISSION] ? (
              <ValidatorsChart
                chartTitle={t(`Comission`)}
                data={validatorCharts[EValidatorChartType.COSMOS_COMISSION]}
                monikers={validatorMonikersWithColors}
                dataMin={0}
                dataMax={1}
                tickFormat={(value: any, index: number) =>
                  `${(value * 100).toFixed(2)}%`
                }
              />
            ) : null}
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

ChartsPage.bothGuard = true;
ChartsPage.acl = { action: "read", subject: Permissions.ANY };
ChartsPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

export default ChartsPage;
