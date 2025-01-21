// ** React Imports
import { ReactNode } from "react";

// ** NextJS Imports
import Head from "next/head";
import { useRouter } from "next/router";

// ** Configs
import { Permissions } from "@configs/acl";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";

// ** Layouts
import UserLayout from "@layouts/UserLayout";

// ** Shared Components
import styles from "@styles/Home.module.css";

// ** MUI Imports
import { Box, Card, CardHeader, Grid } from "@mui/material";

const ChartsPage = () => {
  // ** Hooks
  const { t } = useTranslation();
  const router = useRouter();
  const { dispatch, blockchainValidators } = useBlockchainService();

  // ** Vars
  const { id } = router.query;

  console.log("id: ", id);
  console.log("blockchainValidators: ", blockchainValidators);

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Charts`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t(`Skeleton`)} subheader={t(`Skeleton`)} />
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
