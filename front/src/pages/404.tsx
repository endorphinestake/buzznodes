// ** React Imports
import { ReactNode } from "react";

// ** Next Import
import Link from "next/link";
import Head from 'next/head';

import { useTranslation } from 'react-i18next';

// ** MUI Components
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrations from "@layouts/components/footer/FooterIllustrations";

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Img = styled("img")(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down("lg")]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    height: 400,
  },
}));

const Error404 = () => {
  /** Hooks */
  const { t } = useTranslation();

  return (
    <Box className="content-center">

      <Head>
        <title>404 {t(`Page Not Found`)}</title>
      </Head>

      <Box
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <BoxWrapper>
          <Typography variant="h1" sx={{ mb: 2.5 }}>
            404
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 2.5,
              letterSpacing: "0.18px",
              fontSize: "1.5rem !important",
            }}
          >
            {t(`Page Not Found`)} ⚠️
          </Typography>
          <Typography variant="body2">
            {t(`We couldn't find the page you are looking for`)}...
          </Typography>
        </BoxWrapper>
        <Img alt="error-illustration" src="/images/pages/404.png" />
        <Link passHref href="/">
          <Button component="a" variant="contained" sx={{ px: 5.5 }}>
            {t(`Back to Home`)}
          </Button>
        </Link>
      </Box>
      <FooterIllustrations image="/images/pages/misc-404-object.png" />
    </Box>
  );
};

Error404.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Error404;
