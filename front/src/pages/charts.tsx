// ** React Imports
import { ReactNode, useState, useEffect } from "react";

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

// ** Types & Interfaces Imports
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** MUI Imports
import { Box, Card, CardHeader, Grid } from "@mui/material";

const ChartsPage = () => {
  // ** Hooks
  const { t } = useTranslation();
  const router = useRouter();
  // ** Hooks
  const { isBlockchainValidatorsLoading, blockchainValidators } =
    useBlockchainService();

  // ** State
  const [validators, setValidators] = useState<TBlockchainValidator[]>([]);

  // Autoselect Validator from URL
  useEffect(() => {
    const { validator_id } = router.query;

    if (validator_id && !isBlockchainValidatorsLoading) {
      const selectedValidator = blockchainValidators.find(
        (validator) => validator.id === +validator_id
      );
      if (selectedValidator) {
        setValidators([selectedValidator]);
      }
    }
  }, [router.query, blockchainValidators, isBlockchainValidatorsLoading]);

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
                  <Grid item sm={12} xs={12}>
                    <SelectValidators
                      values={validators}
                      setValues={setValidators}
                      label={t("Select Validator")}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

ChartsPage.authGuard = true;
ChartsPage.acl = { action: "read", subject: Permissions.ANY };
ChartsPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

export default ChartsPage;
