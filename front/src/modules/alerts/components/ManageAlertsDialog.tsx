// ** React Imports
import {
  memo,
  useState,
  useEffect,
  Fragment,
  SyntheticEvent,
  ChangeEvent,
} from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";
import { useDomain } from "@context/DomainContext";

// ** Types & Interfaces & Enums Imports
import { EAlertType } from "@modules/alerts/enums";
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";
import DialogComponent from "@modules/shared/components/Dialog";
import ConfirmDialog from "@modules/shared/components/ConfirmDialog";

// ** Mui Imports
import {
  Tab,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Grid,
  Box,
  Badge,
  Chip,
  Switch,
  FormHelperText,
  InputLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import { TabList, TabPanel, TabContext, LoadingButton } from "@mui/lab";
import { DeleteOutline } from "@mui/icons-material";
import { BellPlus, BellCheck, BellAlert } from "mdi-material-ui";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  blockchainValidator: TBlockchainValidator;
}

const ManageAlertsDialog = (props: IProps) => {
  // ** Props
  const { open, setOpen, blockchainValidator } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { symbol } = useDomain();
  const {
    dispatch,
    alertSettings,
    userAlertSettings,

    isCreatingUserAlertSettingLoading,
    isCreatingUserAlertSettingLoaded,
    isCreatingUserAlertSettingError,

    isUpdatingOrDeletingUserAlertSettingLoading,
    isUpdatingOrDeletingUserAlertSettingLoaded,
    isUpdatingOrDeletingUserAlertSettingError,

    resetCreateUserAlertSettingState,
    resetUpdateOrDeleteUserAlertSettingState,
  } = useAlertService();

  // ** State
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<EAlertType>(
    EAlertType.VOTING_POWER
  );
  const [votingPowerSettingId, setVotingPowerSettingId] = useState<number>(
    userAlertSettings[blockchainValidator.id]?.[EAlertType.VOTING_POWER]?.[0]
      ?.setting_id || 0
  );
  const [uptimeSettingId, setUptimeSettingId] = useState<number>(
    userAlertSettings[blockchainValidator.id]?.[EAlertType.UPTIME]?.[0]
      ?.setting_id || 0
  );
  const [comissionSettingId, setComissionSettingId] = useState<number>(
    userAlertSettings[blockchainValidator.id]?.[EAlertType.COMISSION]?.[0]
      ?.setting_id || 0
  );
  const [jailedSettingId, setJailedSettingId] = useState<number>(
    userAlertSettings[blockchainValidator.id]?.[EAlertType.JAILED]?.[0]
      ?.setting_id || 0
  );
  const [tombstonedSettingId, setTombstonedSettingId] = useState<number>(
    userAlertSettings[blockchainValidator.id]?.[EAlertType.TOMBSTONED]?.[0]
      ?.setting_id || 0
  );

  const handleTabChange = (event: SyntheticEvent, newValue: EAlertType) => {
    setCurrentTab(newValue);
  };

  const handleClose = () => setOpen(false);

  const handleConfirmDelete = () => {
    console.log("handleConfirmDelete...");
  };

  const handleClickDelete = () => setOpenDelete(true);

  return (
    <Fragment>
      <DialogComponent
        open={open}
        setOpen={setOpen}
        handleClose={handleClose}
        title={t("Manage Alerts for «{{moniker}}»", {
          moniker: blockchainValidator.moniker || "",
        })}
        maxWidth="md"
        content={
          <TabContext value={currentTab}>
            <TabList onChange={handleTabChange}>
              <Tab
                value={EAlertType.VOTING_POWER}
                label={t(`Voting Power`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.VOTING_POWER
                  ]?.[0] ? (
                    <BellCheck />
                  ) : (
                    <BellPlus />
                  )
                }
              />
              <Tab
                value={EAlertType.UPTIME}
                label={t(`Uptime`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.UPTIME
                  ]?.[0] ? (
                    <BellCheck />
                  ) : (
                    <BellPlus />
                  )
                }
              />
              <Tab
                value={EAlertType.COMISSION}
                label={t(`Comission`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.COMISSION
                  ]?.[0] ? (
                    <BellCheck />
                  ) : (
                    <BellPlus />
                  )
                }
              />
              <Tab
                value={EAlertType.JAILED}
                label={t(`Jailed`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.JAILED
                  ]?.[0] ? (
                    <BellCheck />
                  ) : (
                    <BellPlus />
                  )
                }
              />
              <Tab
                value={EAlertType.TOMBSTONED}
                label={t(`Tombstoned`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.TOMBSTONED
                  ]?.[0] ? (
                    <BellCheck />
                  ) : (
                    <BellPlus />
                  )
                }
              />
            </TabList>

            <TabPanel
              value={EAlertType.VOTING_POWER}
              sx={{ width: "100%", mt: 4 }}
            >
              <Box>
                <FormControl>
                  <RadioGroup
                    value={votingPowerSettingId}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setVotingPowerSettingId(
                        (event.target as HTMLInputElement).value
                      )
                    }
                  >
                    {alertSettings[EAlertType.VOTING_POWER].map(
                      (alertSetting) => (
                        <FormControlLabel
                          key={alertSetting.id}
                          value={alertSetting.id}
                          control={<Radio />}
                          label={
                            <Fragment>
                              <Typography>
                                {/* will increase by */}
                                {/* will decrease by */}
                                {t(`will increase by`)}{" "}
                                {Intl.NumberFormat("ru-RU").format(
                                  alertSetting.value_from
                                )}
                                <Chip label={symbol} size="small" disabled />
                              </Typography>
                            </Fragment>
                          }
                        />
                      )
                    )}
                    {alertSettings[EAlertType.VOTING_POWER].map(
                      (alertSetting) => (
                        <FormControlLabel
                          key={alertSetting.id + 4}
                          value={alertSetting.id + 4}
                          control={<Radio />}
                          label={
                            <Fragment>
                              <Typography>
                                {/* will increase by */}
                                {/* will decrease by */}
                                {t(`will decrease by`)}{" "}
                                {Intl.NumberFormat("ru-RU").format(
                                  alertSetting.value_from
                                )}
                                <Chip label={symbol} size="small" disabled />
                              </Typography>
                            </Fragment>
                          }
                        />
                      )
                    )}
                  </RadioGroup>
                </FormControl>
              </Box>
            </TabPanel>
            <TabPanel value={EAlertType.UPTIME} sx={{ width: "100%", mt: 4 }}>
              <Typography>
                Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie
                gummi bears jujubes candy canes. Chupa chups sesame snaps
                halvah.
              </Typography>
            </TabPanel>
            <TabPanel
              value={EAlertType.COMISSION}
              sx={{ width: "100%", mt: 4 }}
            >
              <Typography>
                Danish tiramisu jujubes cupcake chocolate bar cake cheesecake
                chupa chups. Macaroon ice cream tootsie roll carrot cake gummi
                bears.
              </Typography>
            </TabPanel>
            <TabPanel value={EAlertType.JAILED} sx={{ width: "100%", mt: 4 }}>
              <Typography>
                Danish tiramisu jujubes cupcake chocolate bar cake cheesecake
                chupa chups. Macaroon ice cream tootsie roll carrot cake gummi
                bears.
              </Typography>
            </TabPanel>
            <TabPanel
              value={EAlertType.TOMBSTONED}
              sx={{ width: "100%", mt: 4 }}
            >
              <Typography>
                Danish tiramisu jujubes cupcake chocolate bar cake cheesecake
                chupa chups. Macaroon ice cream tootsie roll carrot cake gummi
                bears.
              </Typography>
            </TabPanel>
          </TabContext>
        }
      />

      <ConfirmDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title={t(`Are you sure you want to delete alerts?`)}
        onConfirm={handleConfirmDelete}
      />
    </Fragment>
  );
};

export default memo(ManageAlertsDialog);
