// ** React Imports
import { useEffect, ReactNode, useState } from 'react';

// ** Next Imports
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useTranslation } from 'react-i18next';

// ** Mui Imports
import { Box } from '@mui/material';

// ** Component Imports
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Shared Components Imports
import Notify from '@modules/shared/utils/Notify';

// ** Loader Import
import NProgress from 'nprogress';

// ** Hooks
import { useUserService } from '@hooks/useUserService';

const RegisterConfirmPage = () => {
  // ** Hooks
  const router = useRouter();
  const {
    dispatch,
    registerConfirm,
    getProfile,
    isRegisterConfirmLoading,
    isRegisterConfirmLoaded,
    isRegisterConfirmError,
    resetRegisterConfirmState,
  } = useUserService();
  const { t } = useTranslation();

  // ** State
  const [init, setInit] = useState<boolean>(false);

  NProgress.start();

  // Events on load page
  useEffect(() => {
    if (router.query && router.query.token) {
      if(!init) {
        setInit(true);
        dispatch(
          registerConfirm({
            token: router.query.token.toString(),
          })
        );
      }
    }
  }, [router]);

  // Events on registerConfirm state change
  useEffect(() => {
    // isError
    if (isRegisterConfirmError) {
      Notify('error', t(`Invalid or expired verification Token!`));
      dispatch(resetRegisterConfirmState());
      router.push('/login');
    }

    // isSuccess
    if (isRegisterConfirmLoaded) {
      Notify(
        'success',
        t(`Your email has been successfully confirmed! You will now be redirected to your account...`)
      );
      dispatch(resetRegisterConfirmState());
      dispatch(getProfile());
      router.push('/');
    }
  }, [dispatch, isRegisterConfirmLoaded, isRegisterConfirmError]);

  return (
    <Box className='content-center'>
      <Head>
        <title>{t(`Email Verification`)}</title>
      </Head>
    </Box>
  );
};
export default RegisterConfirmPage;

RegisterConfirmPage.guestGuard = true;
RegisterConfirmPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
