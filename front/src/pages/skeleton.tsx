// ** React Imports
import { ReactNode } from 'react';

// ** NextJS Imports
import Head from 'next/head';

// ** Configs
import { Permissions } from '@configs/acl';

// ** Hooks Imports
import { useTranslation } from 'react-i18next';

// ** Layouts
import UserLayout from '@layouts/UserLayout';

// ** Shared Components
import styles from '@styles/Home.module.css';

// ** MUI Imports
import { Box, Card, CardHeader, Grid } from '@mui/material';


const SkeletonPage = () => {
    // ** Hooks
    const { t } = useTranslation();

    return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Dashboard`)}</title>
      </Head>

      <main>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={t(`Skeleton`)}
              subheader={t(`Skeleton`)}
            />
          </Card>
        </Grid>
      </Grid>
      </main>
    </div>
    );
}

SkeletonPage.authGuard = true;
SkeletonPage.acl = { action: 'read', subject: Permissions.ANY };
SkeletonPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>;

export default SkeletonPage;
