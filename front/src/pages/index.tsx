// ** React Imports
import { ReactNode, useState, useEffect } from "react";

// ** Next Imports
import Head from "next/head";

// ** Configs
import { Permissions } from "@configs/acl";

// ** Hooks
import { useTranslation } from "react-i18next";

// ** Layouts
import UserLayout from "@layouts/UserLayout";

// ** Shared Components
import styles from "@styles/Home.module.css";
import CollapsedCard from "@modules/shared/components/CollapsedCard";
import SelectExample from "@modules/shared/components/SelectExample";

// ** Mui Imports
import {
  Grid,
  Card,
  Box,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const HomePage = () => {
  // ** Hooks
  const { t } = useTranslation();

  // ** State
  const [isInit, setIsInit] = useState<boolean>(false);

  // Event onInit
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Dashboard`)}</title>
      </Head>

      <main>
        <Grid container spacing={6} className="match-height">
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={t(`Dashboard`)}
                subheader={t(`Blockchain Monitoring`)}
                action={
                  <Button
                    color="primary"
                    size="medium"
                    variant="contained"
                    onClick={() => {
                      console.log("click addd");
                    }}
                  >
                    <AddIcon /> {t(`Add`)}
                  </Button>
                }
              />

              <CardContent>
                <Grid container spacing={3}>
                  <Grid item sm={4} xs={12}>
                    <SelectExample label="filter 1" />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <SelectExample label="filter 2" />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <SelectExample label="filter 3" />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 10,
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item sm={6} xs={12}>
                      <CollapsedCard>scheme 1</CollapsedCard>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <CollapsedCard>scheme 2</CollapsedCard>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <CollapsedCard>scheme 3</CollapsedCard>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <CollapsedCard>scheme 4</CollapsedCard>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

HomePage.authGuard = true;
HomePage.acl = { action: "read", subject: Permissions.ANY };
HomePage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

export default HomePage;
