// ** React Imports
import { memo, useState, useEffect, Fragment, ChangeEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";
import { useDomain } from "@context/DomainContext";

// ** Types & Interfaces & Enums Imports
import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
import { TAlertSettingSyncStatus } from "@modules/alerts/types";
import { IManageBridgeUserAlertsTabProps } from "@modules/alerts/interfaces";

// ** Utils Imports
import {
  getSettingByUserSettings,
  getUserSettingBySettings,
} from "@modules/alerts/utils";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";
import ManageAlertsButtons from "@modules/alerts/components/ManageAlertsButtons";
import ManageAlertsChannels from "@modules/alerts/components/ManageAlertsChannels";

// ** Mui Imports
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Grid,
  Chip,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

const SyncStatusTab = (props: IManageBridgeUserAlertsTabProps) => {
  // ** Props
  const { blockchainBridge, moniker } = props;

  // ** State
  const [syncStatusIncreasedSetting, setSyncStatusIncreasedSetting] = useState<
    TAlertSettingSyncStatus | undefined
  >(undefined);
  const [syncStatusDecreasedSetting, setSyncStatusDecreasedSetting] = useState<
    TAlertSettingSyncStatus | undefined
  >(undefined);
  const [syncStatusIncreasedChannel, setSyncStatusIncreasedChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);
  const [syncStatusDecreasedChannel, setSyncStatusDecreasedChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);

  // ** Hooks
  const { t } = useTranslation();
  const { symbol } = useDomain();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** Vars
  const increasedSyncStatusSettings = alertSettings[EAlertType.SYNC_STATUS]
    .filter((item) => item.value > 0)
    .sort((a, b) => a.value - b.value);

  const decreasedSyncStatusSettings = alertSettings[EAlertType.SYNC_STATUS]
    .filter((item) => item.value < 0)
    .sort((a, b) => b.value - a.value);

  const syncStatusIncreasedUserSetting = getUserSettingBySettings(
    increasedSyncStatusSettings,
    userAlertSettings[blockchainBridge.id]?.[EAlertType.SYNC_STATUS] || []
  );

  const syncStatusDecreasedUserSetting = getUserSettingBySettings(
    decreasedSyncStatusSettings,
    userAlertSettings[blockchainBridge.id]?.[EAlertType.SYNC_STATUS] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    let payload = [];
    // Update or Create Increase
    if (syncStatusIncreasedSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusIncreasedSetting.id,
        user_setting_id: syncStatusIncreasedUserSetting?.id,
        channel: syncStatusIncreasedChannel,
        moniker: moniker,
      });
      // Delete Increase
    } else if (syncStatusIncreasedUserSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusIncreasedUserSetting.setting_id,
        user_setting_id: syncStatusIncreasedUserSetting.id,
        channel: syncStatusIncreasedUserSetting.channels,
        is_delete: true,
      });
    }

    // Update or Create Decreased
    if (syncStatusDecreasedSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusDecreasedSetting.id,
        user_setting_id: syncStatusDecreasedUserSetting?.id,
        channel: syncStatusDecreasedChannel,
        moniker: moniker,
      });
      // Delete Increase
    } else if (syncStatusDecreasedUserSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusDecreasedUserSetting.setting_id,
        user_setting_id: syncStatusDecreasedUserSetting.id,
        channel: syncStatusDecreasedUserSetting.channels,
        is_delete: true,
      });
    }

    if (payload.length) {
      dispatch(manageUserAlertSetting(payload));
    } else {
      Notify("warning", t(`Parameter not selected!`));
    }
  };

  const handleClearAlerts = () => {
    setSyncStatusIncreasedSetting(undefined);
    setSyncStatusDecreasedSetting(undefined);
  };

  const handleDeleteAlerts = () => {
    let payload = [
      syncStatusIncreasedUserSetting && {
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusIncreasedUserSetting.setting_id,
        user_setting_id: syncStatusIncreasedUserSetting.id,
        channel: syncStatusIncreasedUserSetting.channels,
        is_delete: true,
      },
      syncStatusDecreasedUserSetting && {
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusDecreasedUserSetting.setting_id,
        user_setting_id: syncStatusDecreasedUserSetting.id,
        channel: syncStatusDecreasedUserSetting.channels,
        is_delete: true,
      },
    ].filter(Boolean);

    if (payload.length) {
      dispatch(manageUserAlertSetting(payload));
      handleClearAlerts();
    } else {
      Notify("warning", t(`Parameter not selected!`));
    }
  };

  // Event on BlockchainChanged
  useEffect(() => {
    const increasedSetting = getSettingByUserSettings(
      increasedSyncStatusSettings,
      syncStatusIncreasedUserSetting ? [syncStatusIncreasedUserSetting] : []
    );
    setSyncStatusIncreasedSetting(increasedSetting);

    const decreasedSetting = getSettingByUserSettings(
      decreasedSyncStatusSettings,
      syncStatusDecreasedUserSetting ? [syncStatusDecreasedUserSetting] : []
    );
    setSyncStatusDecreasedSetting(decreasedSetting);

    setSyncStatusIncreasedChannel(
      syncStatusIncreasedUserSetting?.channels ||
        increasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );

    setSyncStatusDecreasedChannel(
      syncStatusDecreasedUserSetting?.channels ||
        decreasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainBridge]);

  return (
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
                  syncStatusIncreasedSetting
                    ? JSON.stringify(syncStatusIncreasedSetting)
                    : ""
                }
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setSyncStatusIncreasedSetting(JSON.parse(event.target.value));
                }}
              >
                {increasedSyncStatusSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={
                      <Fragment>
                        {Intl.NumberFormat("ru-RU").format(alertSetting.value)}
                        <Chip label={t(`blocks`)} size="small" disabled />
                      </Fragment>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={syncStatusIncreasedChannel}
              setChannel={setSyncStatusIncreasedChannel}
              channels={syncStatusIncreasedSetting?.channels || []}
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
                value={JSON.stringify(syncStatusDecreasedSetting) || ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setSyncStatusDecreasedSetting(JSON.parse(event.target.value));
                }}
              >
                {decreasedSyncStatusSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={
                      <Fragment>
                        {Intl.NumberFormat("ru-RU").format(
                          Math.abs(alertSetting.value)
                        )}
                        <Chip label={t(`blocks`)} size="small" disabled />
                      </Fragment>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={syncStatusDecreasedChannel}
              setChannel={setSyncStatusDecreasedChannel}
              channels={syncStatusDecreasedSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={
          !syncStatusIncreasedSetting && !syncStatusDecreasedSetting
        }
        isCanDelete={
          Boolean(syncStatusIncreasedUserSetting) ||
          Boolean(syncStatusDecreasedUserSetting)
        }
      />
    </Grid>
  );
};

export default memo(SyncStatusTab);
