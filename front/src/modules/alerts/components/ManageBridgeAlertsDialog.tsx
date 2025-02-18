// ** React Imports
import { memo, useState, useEffect, Fragment, SyntheticEvent } from "react";

// ** Hooks ImportshandleClose
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import { EAlertType } from "@modules/alerts/enums";
import { TBlockchainBridge } from "@modules/blockchains/types";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";
import DialogComponent from "@modules/shared/components/Dialog";
import VotingPowerTab from "@modules/alerts/components/tabs/VotingPowerTab";
import UptimeTab from "@modules/alerts/components/tabs/UptimeTab";
import ComissionTab from "@modules/alerts/components/tabs/ComissionTab";
import JailedTab from "@modules/alerts/components/tabs/JailedTab";
import BondedTab from "@modules/alerts/components/tabs/BondedTab";
import TombstonedTab from "@modules/alerts/components/tabs/TombstonedTab";

// ** Mui Imports
import { Tab, Typography } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { BellPlus, BellCheck } from "mdi-material-ui";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  blockchainBridge: TBlockchainBridge;
}

const ManageBridgeAlertsDialog = (props: IProps) => {
  // ** Props
  const { open, setOpen, blockchainBridge } = props;

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
    EAlertType.OTEL_UPDATE
  );

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
        title={t("Manage Alerts for «{{bridge}}»", {
          bridge: blockchainBridge.node_id,
        })}
        maxWidth="md"
        content={
          <TabContext value={currentTab}>
            <TabList onChange={handleTabChange}>
              <Tab
                value={EAlertType.OTEL_UPDATE}
                label={t(`Latest Otel Update`)}
                icon={
                  userAlertSettings[blockchainBridge.id]?.[
                    EAlertType.OTEL_UPDATE
                  ]?.[0] ? (
                    <BellCheck />
                  ) : (
                    <BellPlus />
                  )
                }
              />
              <Tab
                value={EAlertType.SYNC_STATUS}
                label={t(`Synchronization Status`)}
                icon={
                  userAlertSettings[blockchainBridge.id]?.[
                    EAlertType.SYNC_STATUS
                  ]?.[0] ? (
                    <BellCheck />
                  ) : (
                    <BellPlus />
                  )
                }
              />
            </TabList>

            <TabPanel
              value={EAlertType.OTEL_UPDATE}
              sx={{ width: "100%", mt: 4 }}
            >
              {/* <VotingPowerTab blockchainValidator={blockchainValidator} /> */}
            </TabPanel>
            <TabPanel
              value={EAlertType.SYNC_STATUS}
              sx={{ width: "100%", mt: 4 }}
            >
              {/* <UptimeTab blockchainValidator={blockchainValidator} /> */}
            </TabPanel>
          </TabContext>
        }
      />
    </Fragment>
  );
};

export default memo(ManageBridgeAlertsDialog);
