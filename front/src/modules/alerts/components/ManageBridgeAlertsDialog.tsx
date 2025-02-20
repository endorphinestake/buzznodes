// ** React Imports
import {
  memo,
  useState,
  useEffect,
  Fragment,
  SyntheticEvent,
  ChangeEvent,
} from "react";

// ** Hooks ImportshandleClose
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import { EAlertType } from "@modules/alerts/enums";
import { TBlockchainBridge } from "@modules/blockchains/types";

// ** Utils Imports
import { isASCII } from "@modules/shared/utils/text";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";
import DialogComponent from "@modules/shared/components/Dialog";
import OtelUpdateTab from "@modules/alerts/components/tabs/OtelUpdateTab";
import SyncStatusTab from "@modules/alerts/components/tabs/SyncStatusTab";

// ** Mui Imports
import { Box, Tooltip, Input, Tab, Typography } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { BellPlus, BellCheck, InformationOutline } from "mdi-material-ui";

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
  const [moniker, setMoniker] = useState<string>("");
  const [monikerError, setMonikerError] = useState<boolean>(true);

  // ** Handlers
  const handleTabChange = (event: SyntheticEvent, newValue: EAlertType) => {
    setCurrentTab(newValue);
  };

  const handleClose = () => setOpen(false);

  const handleMonikerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMoniker(event.target.value);
    setMonikerError(
      Boolean(
        !event.target.value ||
          event.target.value.length > 50 ||
          !isASCII(event.target.value)
      )
    );
  };

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

  // Event on Show Popup
  useEffect(() => {
    const moniker =
      userAlertSettings[blockchainBridge.id]?.[EAlertType.OTEL_UPDATE]?.[0]
        ?.moniker ||
      userAlertSettings[blockchainBridge.id]?.[EAlertType.SYNC_STATUS]?.[0]
        ?.moniker ||
      "";
    setMoniker(moniker);
    setMonikerError(!Boolean(moniker));
  }, [blockchainBridge]);

  return (
    <DialogComponent
      open={open}
      setOpen={setOpen}
      handleClose={handleClose}
      titleNode={
        <Fragment>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Typography variant="body1">
              {t(`Manage Alerts for Bridge`)}
            </Typography>
            <Tooltip
              title={t(
                `The name must contain no more than 50 characters only from ASCII symbols`
              )}
            >
              <InformationOutline
                sx={{ fontSize: 20 }}
                color={monikerError ? "error" : "primary"}
              />
            </Tooltip>
            <Input
              sx={{ flex: 0.99 }}
              value={moniker}
              onChange={handleMonikerChange}
              error={monikerError}
              placeholder={t(`Your Bridge name...`)}
            />
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {t(`Bridge ID`)}: {blockchainBridge.node_id}
          </Typography>
        </Fragment>
      }
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
                  <BellCheck color="success" />
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
                  <BellCheck color="success" />
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
            <OtelUpdateTab
              blockchainBridge={blockchainBridge}
              moniker={moniker}
            />
          </TabPanel>
          <TabPanel
            value={EAlertType.SYNC_STATUS}
            sx={{ width: "100%", mt: 4 }}
          >
            <SyncStatusTab
              blockchainBridge={blockchainBridge}
              moniker={moniker}
            />
          </TabPanel>
        </TabContext>
      }
    />
  );
};

export default memo(ManageBridgeAlertsDialog);
