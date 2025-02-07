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
import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
import { TAlertSettingVotingPower } from "@modules/alerts/types";
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** Utils Imports
import {
  getSettingByUserSettings,
  getUserSettingBySettings,
} from "@modules/alerts/utils";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";
import DialogComponent from "@modules/shared/components/Dialog";
import ManageAlertsButtons from "@modules/alerts/components/ManageAlertsButtons";
import ManageAlertsChannels from "@modules/alerts/components/ManageAlertsChannels";

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
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { BellPlus, BellCheck } from "mdi-material-ui";

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
    fetchUserAlertSettings,
    createUserAlertSetting,
    updateOrDeleteUserAlertSetting,

    isCreatingUserAlertSettingLoading,
    isCreatingUserAlertSettingLoaded,
    isCreatingUserAlertSettingError,

    isUpdatingOrDeletingUserAlertSettingLoading,
    isUpdatingOrDeletingUserAlertSettingLoaded,
    isUpdatingOrDeletingUserAlertSettingError,

    resetCreateUserAlertSettingState,
    resetUpdateOrDeleteUserAlertSettingState,

    alertSettings,
    userAlertSettings,
  } = useAlertService();

  if (!alertSettings) return <></>;

  // ** Vars

  // VotingPower
  const increasedVotingPowerSettings = alertSettings[EAlertType.VOTING_POWER]
    .filter((item) => item.value > 0)
    .sort((a, b) => a.value - b.value);

  const decreasedVotingPowerSettings = alertSettings[EAlertType.VOTING_POWER]
    .filter((item) => item.value < 0)
    .sort((a, b) => b.value - a.value);

  const votingPowerIncreasedUserSetting = getUserSettingBySettings(
    increasedVotingPowerSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.VOTING_POWER] || []
  );

  const votingPowerDecreasedUserSetting = getUserSettingBySettings(
    decreasedVotingPowerSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.VOTING_POWER] || []
  );

  // Uptime
  const increasedUptimeSettings = alertSettings[EAlertType.UPTIME]
    .filter((item) => item.value > 0)
    .sort((a, b) => a.value - b.value);

  const decreasedUptimeSettings = alertSettings[EAlertType.UPTIME]
    .filter((item) => item.value < 0)
    .sort((a, b) => b.value - a.value);

  // ** State
  const [currentTab, setCurrentTab] = useState<EAlertType>(
    EAlertType.VOTING_POWER
  );
  const [votingPowerIncreasedSetting, setVotingPowerIncreasedSetting] =
    useState<TAlertSettingVotingPower | undefined>(
      getSettingByUserSettings(
        increasedVotingPowerSettings,
        [votingPowerIncreasedUserSetting ?? []].flat()
      )
    );
  const [votingPowerDecreasedSetting, setVotingPowerDecreasedSetting] =
    useState<TAlertSettingVotingPower | undefined>(
      getSettingByUserSettings(
        decreasedVotingPowerSettings,
        userAlertSettings[blockchainValidator.id]?.[EAlertType.VOTING_POWER] ||
          []
      )
    );
  const [votingPowerIncreasedChannel, setVotingPowerIncreasedChannel] =
    useState<EAlertChannel>(
      votingPowerIncreasedUserSetting?.channels ||
        votingPowerIncreasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );

  const [votingPowerDecreasedChannel, setVotingPowerDecreasedChannel] =
    useState<EAlertChannel>(
      votingPowerDecreasedUserSetting?.channels ||
        votingPowerDecreasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
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
    switch (currentTab) {
      case EAlertType.VOTING_POWER:
        console.log("todo save voting power...");

        // // Update
        // if() {

        //   // Create
        // } else {

        // }

        let payload = [
          votingPowerIncreasedSetting &&
            votingPowerIncreasedChannel && {
              blockchain_validator_id: blockchainValidator.id,
              setting_id: votingPowerIncreasedSetting.id,
              channel: votingPowerIncreasedChannel,
            },
          votingPowerDecreasedSetting &&
            votingPowerDecreasedChannel && {
              blockchain_validator_id: blockchainValidator.id,
              setting_id: votingPowerDecreasedSetting.id,
              channel: votingPowerDecreasedChannel,
            },
        ].filter(Boolean);

        if (payload.length) {
          dispatch(createUserAlertSetting(payload));
        } else {
          Notify("warning", t("Parameter not selected!"));
        }
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
        let payload = [
          votingPowerIncreasedUserSetting && {
            blockchain_validator_id: blockchainValidator.id,
            setting_id: votingPowerIncreasedUserSetting.setting_id,
            user_setting_id: votingPowerIncreasedUserSetting.id,
            channel: votingPowerIncreasedUserSetting.channels,
            is_delete: true,
          },
          votingPowerDecreasedUserSetting && {
            blockchain_validator_id: blockchainValidator.id,
            setting_id: votingPowerDecreasedUserSetting.setting_id,
            user_setting_id: votingPowerDecreasedUserSetting.id,
            channel: votingPowerDecreasedUserSetting.channels,
            is_delete: true,
          },
        ].filter(Boolean);

        if (payload.length) {
          dispatch(updateOrDeleteUserAlertSetting(payload));
        } else {
          Notify("warning", t("Parameter not selected!"));
        }
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

  // Events for createUserAlertSetting
  useEffect(() => {
    // Success
    if (isCreatingUserAlertSettingLoaded) {
      Notify("info", t(`Alert settings saved successfully!`));
      dispatch(resetCreateUserAlertSettingState());
      dispatch(fetchUserAlertSettings());
    }

    // Error
    if (
      isCreatingUserAlertSettingError &&
      typeof isCreatingUserAlertSettingError.response?.data === "object"
    ) {
      if (isCreatingUserAlertSettingError?.response?.data) {
        Object.entries(isCreatingUserAlertSettingError.response.data).forEach(
          ([key, value]) => {
            if (value) {
              Notify("error", value.toString());
            }
          }
        );
      }
      dispatch(resetCreateUserAlertSettingState());
    } else if (
      typeof isCreatingUserAlertSettingError?.response?.data === "string"
    ) {
      Notify("error", isCreatingUserAlertSettingError.response.data.toString());
      dispatch(resetCreateUserAlertSettingState());
    }
  }, [isCreatingUserAlertSettingLoaded, isCreatingUserAlertSettingError]);

  // Events for updateOrDeleteUserAlertSetting
  useEffect(() => {
    // Success
    if (isUpdatingOrDeletingUserAlertSettingLoaded) {
      Notify("info", t(`Alert settings changed successfully!`));
      dispatch(resetUpdateOrDeleteUserAlertSettingState());
      dispatch(fetchUserAlertSettings());
    }

    // Error
    if (
      isUpdatingOrDeletingUserAlertSettingError &&
      typeof isUpdatingOrDeletingUserAlertSettingError.response?.data ===
        "object"
    ) {
      if (isUpdatingOrDeletingUserAlertSettingError?.response?.data) {
        Object.entries(
          isUpdatingOrDeletingUserAlertSettingError.response.data
        ).forEach(([key, value]) => {
          if (value) {
            Notify("error", value.toString());
          }
        });
      }
      dispatch(resetUpdateOrDeleteUserAlertSettingState());
    } else if (
      typeof isUpdatingOrDeletingUserAlertSettingError?.response?.data ===
      "string"
    ) {
      Notify(
        "error",
        isUpdatingOrDeletingUserAlertSettingError.response.data.toString()
      );
      dispatch(resetUpdateOrDeleteUserAlertSettingState());
    }
  }, [
    isUpdatingOrDeletingUserAlertSettingLoaded,
    isUpdatingOrDeletingUserAlertSettingError,
  ]);

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
                              control={
                                <Radio
                                  disabled={!alertSetting.channels.length}
                                />
                              }
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

                      <ManageAlertsChannels
                        channel={votingPowerIncreasedChannel}
                        setChannel={setVotingPowerIncreasedChannel}
                        channels={votingPowerIncreasedSetting?.channels || []}
                      />
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
                              control={
                                <Radio
                                  disabled={!alertSetting.channels.length}
                                />
                              }
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

                      <ManageAlertsChannels
                        channel={votingPowerDecreasedChannel}
                        setChannel={setVotingPowerDecreasedChannel}
                        channels={votingPowerDecreasedSetting?.channels || []}
                      />
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
