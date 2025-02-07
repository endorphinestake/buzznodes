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
import { TAlertSettingVotingPower } from "@modules/alerts/types";
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** Utils Imports
import { getSettingVotingPowerByUserSettings } from "@modules/alerts/utils";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";
import DialogComponent from "@modules/shared/components/Dialog";
import ConfirmDialog from "@modules/shared/components/ConfirmDialog";
import ManageAlertsButtons from "@modules/alerts/components/ManageAlertsButtons";

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
  Card,
  CardHeader,
  CardContent,
  Button,
} from "@mui/material";
import { TabList, TabPanel, TabContext, LoadingButton } from "@mui/lab";
import { DeleteOutline } from "@mui/icons-material";
import { BellPlus, BellCheck, BellRemove } from "mdi-material-ui";

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

  if (!alertSettings) return <></>;

  // ** Vars
  const increasedVotingPowerSettings = alertSettings[EAlertType.VOTING_POWER]
    .filter((item) => item.value > 0)
    .sort((a, b) => a.value - b.value);

  const decreasedVotingPowerSettings = alertSettings[EAlertType.VOTING_POWER]
    .filter((item) => item.value < 0)
    .sort((a, b) => b.value - a.value);

  // ** State
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<EAlertType>(
    EAlertType.VOTING_POWER
  );
  const [votingPowerIncreasedSetting, setVotingPowerIncreasedSetting] =
    useState<TAlertSettingVotingPower | undefined>(
      getSettingVotingPowerByUserSettings(
        increasedVotingPowerSettings,
        userAlertSettings[blockchainValidator.id]?.[EAlertType.VOTING_POWER] ||
          []
      )
    );

  const [votingPowerDecreasedSetting, setVotingPowerDecreasedSetting] =
    useState<TAlertSettingVotingPower | undefined>(
      getSettingVotingPowerByUserSettings(
        decreasedVotingPowerSettings,
        userAlertSettings[blockchainValidator.id]?.[EAlertType.VOTING_POWER] ||
          []
      )
    );

  // const [uptimeSettingId, setUptimeSettingId] = useState<number>(
  //   userAlertSettings[blockchainValidator.id]?.[EAlertType.UPTIME]?.[0]
  //     ?.setting_id || 0
  // );
  // const [comissionSettingId, setComissionSettingId] = useState<number>(
  //   userAlertSettings[blockchainValidator.id]?.[EAlertType.COMISSION]?.[0]
  //     ?.setting_id || 0
  // );
  // const [jailedSettingId, setJailedSettingId] = useState<number>(
  //   userAlertSettings[blockchainValidator.id]?.[EAlertType.JAILED]?.[0]
  //     ?.setting_id || 0
  // );
  // const [tombstonedSettingId, setTombstonedSettingId] = useState<number>(
  //   userAlertSettings[blockchainValidator.id]?.[EAlertType.TOMBSTONED]?.[0]
  //     ?.setting_id || 0
  // );
  // const [bondedSettingId, setBondedSettingId] = useState<number>(
  //   userAlertSettings[blockchainValidator.id]?.[EAlertType.BONDED]?.[0]
  //     ?.setting_id || 0
  // );

  // ** Vars2
  // const  alertSettings.find((item) => item.id === idToFind)

  // ** Handlers
  const handleTabChange = (event: SyntheticEvent, newValue: EAlertType) => {
    setCurrentTab(newValue);
  };

  const handleClose = () => setOpen(false);

  const handleSaveAlerts = () => {
    console.log("currentTab: ", currentTab);
    switch (currentTab) {
      case EAlertType.VOTING_POWER:
        console.log("todo save voting power...");
        break;
      case EAlertType.UPTIME:
        console.log("todo save uptime...");
        break;
      case EAlertType.COMISSION:
        console.log("todo save comission...");
        break;
      case EAlertType.JAILED:
        console.log("todo save jailed...");
        break;
      case EAlertType.TOMBSTONED:
        console.log("todo save tombstoned...");
        break;
      case EAlertType.BONDED:
        console.log("todo save bonded...");
        break;
      default:
        console.error("Unknown EAlertType!");
    }
  };

  const handleClearAlerts = () => {
    console.log("currentTab: ", currentTab);
    switch (currentTab) {
      case EAlertType.VOTING_POWER:
        setVotingPowerIncreasedSetting(undefined);
        setVotingPowerDecreasedSetting(undefined);
        break;
      case EAlertType.UPTIME:
        console.log("todo clear uptime...");
        break;
      case EAlertType.COMISSION:
        console.log("todo clear comission...");
        break;
      case EAlertType.JAILED:
        console.log("todo clear jailed...");
        break;
      case EAlertType.TOMBSTONED:
        console.log("todo clear tombstoned...");
        break;
      case EAlertType.BONDED:
        console.log("todo clear bonded...");
        break;
      default:
        console.error("Unknown EAlertType!");
    }
  };

  const handleDeleteAlerts = () => {
    console.log("currentTab: ", currentTab);
    switch (currentTab) {
      case EAlertType.VOTING_POWER:
        console.log("todo delete voting power...");
        break;
      case EAlertType.UPTIME:
        console.log("todo delete uptime...");
        break;
      case EAlertType.COMISSION:
        console.log("todo delete comission...");
        break;
      case EAlertType.JAILED:
        console.log("todo delete jailed...");
        break;
      case EAlertType.TOMBSTONED:
        console.log("todo delete tombstoned...");
        break;
      case EAlertType.BONDED:
        console.log("todo delete bonded...");
        break;
      default:
        console.error("Unknown EAlertType!");
    }
  };

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
              <Tab
                value={EAlertType.BONDED}
                label={t(`Bonded status`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.BONDED
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
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <Card>
                    <CardHeader
                      title={t(`When the value increases`)}
                      titleTypographyProps={{ variant: "h6" }}
                    />
                    <CardContent>
                      <FormControl>
                        <RadioGroup
                          value={
                            JSON.stringify(votingPowerIncreasedSetting) || ""
                          }
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setVotingPowerIncreasedSetting(
                              JSON.parse(event.target.value)
                            );
                          }}
                        >
                          {increasedVotingPowerSettings.map((alertSetting) => (
                            <FormControlLabel
                              key={alertSetting.id}
                              value={JSON.stringify(alertSetting)}
                              control={<Radio />}
                              label={
                                <Fragment>
                                  {Intl.NumberFormat("ru-RU").format(
                                    alertSetting.value
                                  )}
                                  <Chip label={symbol} size="small" disabled />
                                </Fragment>
                              }
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardHeader
                      title={t(`When the value decreases`)}
                      titleTypographyProps={{ variant: "h6" }}
                    />
                    <CardContent>
                      <FormControl>
                        <RadioGroup
                          value={
                            JSON.stringify(votingPowerDecreasedSetting) || ""
                          }
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setVotingPowerDecreasedSetting(
                              JSON.parse(event.target.value)
                            );
                          }}
                        >
                          {decreasedVotingPowerSettings.map((alertSetting) => (
                            <FormControlLabel
                              key={alertSetting.id}
                              value={JSON.stringify(alertSetting)}
                              control={<Radio />}
                              label={
                                <Fragment>
                                  {Intl.NumberFormat("ru-RU").format(
                                    Math.abs(alertSetting.value)
                                  )}
                                  <Chip label={symbol} size="small" disabled />
                                </Fragment>
                              }
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>

                <ManageAlertsButtons
                  handleSaveAlerts={handleSaveAlerts}
                  handleClearAlerts={handleClearAlerts}
                  handleDeleteAlerts={handleDeleteAlerts}
                  isDisabledSave={
                    !votingPowerIncreasedSetting && !votingPowerDecreasedSetting
                  }
                  isCanDelete={Boolean(
                    userAlertSettings[blockchainValidator.id]?.[
                      EAlertType.VOTING_POWER
                    ]?.length
                  )}
                />
              </Grid>
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
            <TabPanel value={EAlertType.BONDED} sx={{ width: "100%", mt: 4 }}>
              <Typography>
                Danish tiramisu jujubes cupcake chocolate bar cake cheesecake
                chupa chups. Macaroon ice cream tootsie roll carrot cake gummi
                bears.
              </Typography>
            </TabPanel>
          </TabContext>
        }
      />
    </Fragment>
  );
};

export default memo(ManageAlertsDialog);
