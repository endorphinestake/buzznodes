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
import { useDomain } from "@context/DomainContext";

// ** Layouts
import UserLayout from "@layouts/UserLayout";

// ** Types & Interfaces Imports
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** Shared Components
import styles from "@styles/Home.module.css";
import SelectValidators from "@modules/blockchains/components/SelectValidators";
import ValidatorButtons from "@modules/blockchains/components/details/ValidatorButtons";
import ValidatorStatus from "@modules/blockchains/components/details/ValidatorStatus";
import ValidatorJailedStatus from "@modules/blockchains/components/details/ValidatorJailedStatus";

// ** MUI Imports
import {
  Card,
  CardHeader,
  Grid,
  CircularProgress,
  CardContent,
  Divider,
} from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";

const ValidatorDetailsPage = () => {
  // ** Hooks
  const { t } = useTranslation();
  const { blockchainId } = useDomain();
  const router = useRouter();
  // ** Hooks
  const {
    dispatch,
    fetchBlockchainValidatorDetail,
    isBlockchainValidatorDetailLoading,
    blockchainValidators,
    blockchainValidator,
  } = useBlockchainService();

  // ** State
  const [validator, setValidator] = useState<TBlockchainValidator>();

  // Autoselect Validator from URL or List
  useEffect(() => {
    const { validator_id } = router.query;

    if (validator_id && !isBlockchainValidatorDetailLoading) {
      const selectedValidator = blockchainValidators.validators.find(
        (validator) => validator.id === +validator_id
      );

      if (selectedValidator) {
        setValidator(selectedValidator);
      }
    }
  }, [router.query, blockchainValidators]);

  // Fetch Validator Detail Info
  useEffect(() => {
    if (validator && !isBlockchainValidatorDetailLoading) {
      dispatch(
        fetchBlockchainValidatorDetail({
          blockchainId: blockchainId,
          validatorId: validator.id,
        })
      );
    }
  }, [validator]);

  console.log("blockchainValidator: ", blockchainValidator);

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Validator Details`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={t(`Validator Details`)}
                subheader={t(
                  `Contact Information, Сommission rates, Wallet and more`
                )}
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
                      label={t("Select Validator")}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12} sx={{ mt: 1 }}></Grid>
                </Grid>
              </Box>

              <Divider />

              {isBlockchainValidatorDetailLoading || !validator ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <CardContent>
                  <Grid container spacing={4}>
                    {/* Validator Buttons */}
                    <Grid item xs={12} sm={6}>
                      <ValidatorButtons validator={validator} />
                    </Grid>

                    {/* <Grid item xs={12} sm={1}></Grid> */}

                    {/* Validator Status */}
                    <Grid item xs={12} sm={3}>
                      <ValidatorStatus validator={validator} />
                    </Grid>

                    {/* Validator Jailed Status */}
                    <Grid item xs={12} sm={3}>
                      <ValidatorJailedStatus validator={validator} />
                    </Grid>
                  </Grid>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

ValidatorDetailsPage.authGuard = true;
ValidatorDetailsPage.acl = { action: "read", subject: Permissions.ANY };
ValidatorDetailsPage.getLayout = (page: ReactNode) => (
  <UserLayout>{page}</UserLayout>
);

export default ValidatorDetailsPage;
