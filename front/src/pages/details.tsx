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

// ** MUI Imports
import {
  Card,
  CardHeader,
  Grid,
  CircularProgress,
  Typography,
  CardContent,
  Divider,
} from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  LockOpenOutline,
  AccountOutline,
  StarOutline,
  TrendingUp,
} from "mdi-material-ui";

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

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
      const selectedValidator = blockchainValidators.find(
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

              {isBlockchainValidatorDetailLoading ? (
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
                <Grid item xs={12} sm={7}>
                  <CardContent
                    sx={{
                      p: (theme) =>
                        `${theme.spacing(3.25, 5.75, 6.25)} !important`,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {blockchainValidator?.moniker}
                    </Typography>
                    <Typography variant="body2">
                      {blockchainValidator?.details}
                    </Typography>
                    <Divider sx={{ my: 7 }} />
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={5}>
                        <StyledBox>
                          <Box
                            sx={{
                              py: 1.25,
                              mb: 4,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <LockOpenOutline
                              sx={{ color: "primary.main", mr: 2.5 }}
                              fontSize="small"
                            />
                            <Typography variant="body2">Full Access</Typography>
                          </Box>
                          <Box
                            sx={{
                              py: 1.25,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <AccountOutline
                              sx={{ color: "primary.main", mr: 2.5 }}
                              fontSize="small"
                            />
                            <Typography variant="body2">15 Members</Typography>
                          </Box>
                        </StyledBox>
                      </Grid>
                      <Grid item xs={12} sm={7}>
                        <Box
                          sx={{
                            py: 1.25,
                            mb: 4,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <StarOutline
                            sx={{ color: "primary.main", mr: 2.5 }}
                            fontSize="small"
                          />
                          <Typography variant="body2">
                            Access all Features
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            py: 1.25,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <TrendingUp
                            sx={{ color: "primary.main", mr: 2.5 }}
                            fontSize="small"
                          />
                          <Typography variant="body2">
                            Lifetime Free Update
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Grid>
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
