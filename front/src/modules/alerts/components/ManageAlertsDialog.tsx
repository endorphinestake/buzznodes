// ** React Imports
import { memo, useState, useEffect, Fragment, SyntheticEvent } from "react";

// ** Hooks ImportshandleClose
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import { EAlertType } from "@modules/alerts/enums";
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";
import DialogComponent from "@modules/shared/components/Dialog";
import VotingPowerTab from "@modules/alerts/components/tabs/VotingPowerTab";
import UptimeTab from "@modules/alerts/components/tabs/UptimeTab";
import ComissionTab from "@modules/alerts/components/tabs/ComissionTab";
import JailedTab from "@modules/alerts/components/tabs/JailedTab";

// ** Mui Imports
import { Tab, Typography } from "@mui/material";
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
  const {
    dispatch,
    fetchUserAlertSettings,
    isManageUserAlertSettingLoaded,
    isManageUserAlertSettingError,
    resetManageUserAlertSettingState,
    alertSettings,
    userAlertSettings,
  } = useAlertService();

  if (!alertSettings) return <></>;

  // ** State
  const [currentTab, setCurrentTab] = useState<EAlertType>(
    EAlertType.VOTING_POWER
  );

  // // Tombstoned status
  // const [tombstonedFalseToTrueSetting, setTombstonedFalseToTrueSetting] =
  //   useState<boolean>(false);
  // const [tombstonedStatusChannel, setTombstonedStatusChannel] =
  //   useState<EAlertChannel>(EAlertChannel.SMS);

  // // Bonded status
  // const [bondedFalseToTrueSetting, setBondedFalseToTrueSetting] =
  //   useState<boolean>(false);
  // const [bondedTrueToFalseSetting, setBondedTrueToFalseSetting] =
  //   useState<boolean>(false);
  // const [bondedStatusChannel, setBondedStatusChannel] = useState<EAlertChannel>(
  //   EAlertChannel.SMS
  // );

  // ** Handlers
  const handleTabChange = (event: SyntheticEvent, newValue: EAlertType) => {
    setCurrentTab(newValue);
  };

  const handleClose = () => setOpen(false);

  // Events for createUserAlertSetting
  useEffect(() => {
    // Success
    if (isManageUserAlertSettingLoaded) {
      Notify("info", t(`Alert settings saved successfully!`));
      dispatch(resetManageUserAlertSettingState());
      dispatch(fetchUserAlertSettings());
    }

    // Error
    if (
      isManageUserAlertSettingError &&
      typeof isManageUserAlertSettingError.response?.data === "object"
    ) {
      if (isManageUserAlertSettingError?.response?.data) {
        Object.entries(isManageUserAlertSettingError.response.data).forEach(
          ([key, value]) => {
            if (value) {
              Notify("error", value.toString());
            }
          }
        );
      }
      dispatch(resetManageUserAlertSettingState());
    } else if (
      typeof isManageUserAlertSettingError?.response?.data === "string"
    ) {
      Notify("error", isManageUserAlertSettingError.response.data.toString());
      dispatch(resetManageUserAlertSettingState());
    }
  }, [isManageUserAlertSettingLoaded, isManageUserAlertSettingError]);

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
                label={t(`Jailed status`)}
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
              <VotingPowerTab blockchainValidator={blockchainValidator} />
            </TabPanel>
            <TabPanel value={EAlertType.UPTIME} sx={{ width: "100%", mt: 4 }}>
              <UptimeTab blockchainValidator={blockchainValidator} />
            </TabPanel>
            <TabPanel
              value={EAlertType.COMISSION}
              sx={{ width: "100%", mt: 4 }}
            >
              <ComissionTab blockchainValidator={blockchainValidator} />
            </TabPanel>
            <TabPanel value={EAlertType.JAILED} sx={{ width: "100%", mt: 4 }}>
              <JailedTab blockchainValidator={blockchainValidator} />
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
