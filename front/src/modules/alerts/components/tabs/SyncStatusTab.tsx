// ** React Imports
import { memo, useState, useEffect, Fragment, ChangeEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

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
  const [syncStatusLess300Setting, setSyncStatusLess300Setting] = useState<
    TAlertSettingSyncStatus | undefined
  >(undefined);
  const [syncStatusMore300Setting, setSyncStatusMore300Setting] = useState<
    TAlertSettingSyncStatus | undefined
  >(undefined);
  const [syncStatusLess300Channel, setSyncStatusLess300Channel] =
    useState<EAlertChannel>(EAlertChannel.SMS);
  const [syncStatusMore300Channel, setSyncStatusMore300Channel] =
    useState<EAlertChannel>(EAlertChannel.SMS);

  // ** Hooks
  const { t } = useTranslation();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** Vars
  const less300SyncStatusSettings = alertSettings[EAlertType.SYNC_STATUS]
    .filter((item) => item.value <= 300)
    .sort((a, b) => a.value - b.value);

  const more300SyncStatusSettings = alertSettings[EAlertType.SYNC_STATUS]
    .filter((item) => item.value > 300)
    .sort((a, b) => a.value - b.value);

  const syncStatusLess300UserSetting = getUserSettingBySettings(
    less300SyncStatusSettings,
    userAlertSettings[blockchainBridge.id]?.[EAlertType.SYNC_STATUS] || []
  );

  const syncStatusMore300UserSetting = getUserSettingBySettings(
    more300SyncStatusSettings,
    userAlertSettings[blockchainBridge.id]?.[EAlertType.SYNC_STATUS] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    let payload = [];
    // Update or Create Increase
    if (syncStatusLess300Setting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusLess300Setting.id,
        user_setting_id: syncStatusLess300UserSetting?.id,
        channel: syncStatusLess300Channel,
        moniker: moniker,
      });
      // Delete Increase
    } else if (syncStatusLess300UserSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusLess300UserSetting.setting_id,
        user_setting_id: syncStatusLess300UserSetting.id,
        channel: syncStatusLess300UserSetting.channels,
        is_delete: true,
      });
    }

    // Update or Create More300
    if (syncStatusMore300Setting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusMore300Setting.id,
        user_setting_id: syncStatusMore300UserSetting?.id,
        channel: syncStatusMore300Channel,
        moniker: moniker,
      });
      // Delete Increase
    } else if (syncStatusMore300UserSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusMore300UserSetting.setting_id,
        user_setting_id: syncStatusMore300UserSetting.id,
        channel: syncStatusMore300UserSetting.channels,
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
    setSyncStatusLess300Setting(undefined);
    setSyncStatusMore300Setting(undefined);
  };

  const handleDeleteAlerts = () => {
    let payload = [
      syncStatusLess300UserSetting && {
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusLess300UserSetting.setting_id,
        user_setting_id: syncStatusLess300UserSetting.id,
        channel: syncStatusLess300UserSetting.channels,
        is_delete: true,
      },
      syncStatusMore300UserSetting && {
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.SYNC_STATUS,
        setting_id: syncStatusMore300UserSetting.setting_id,
        user_setting_id: syncStatusMore300UserSetting.id,
        channel: syncStatusMore300UserSetting.channels,
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
    const less300Setting = getSettingByUserSettings(
      less300SyncStatusSettings,
      syncStatusLess300UserSetting ? [syncStatusLess300UserSetting] : []
    );
    setSyncStatusLess300Setting(less300Setting);

    const more300Setting = getSettingByUserSettings(
      more300SyncStatusSettings,
      syncStatusMore300UserSetting ? [syncStatusMore300UserSetting] : []
    );
    setSyncStatusMore300Setting(more300Setting);

    setSyncStatusLess300Channel(
      syncStatusLess300UserSetting?.channels ||
        less300Setting?.channels?.[0] ||
        EAlertChannel.SMS
    );

    setSyncStatusMore300Channel(
      syncStatusMore300UserSetting?.channels ||
        more300Setting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainBridge]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`Behind`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormControl>
              <RadioGroup
                value={
                  syncStatusLess300Setting
                    ? JSON.stringify(syncStatusLess300Setting)
                    : ""
                }
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setSyncStatusLess300Setting(JSON.parse(event.target.value));
                }}
              >
                {less300SyncStatusSettings.map((alertSetting) => (
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
              channel={syncStatusLess300Channel}
              setChannel={setSyncStatusLess300Channel}
              channels={syncStatusLess300Setting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`Behind`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormControl>
              <RadioGroup
                value={JSON.stringify(syncStatusMore300Setting) || ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setSyncStatusMore300Setting(JSON.parse(event.target.value));
                }}
              >
                {more300SyncStatusSettings.map((alertSetting) => (
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
              channel={syncStatusMore300Channel}
              setChannel={setSyncStatusMore300Channel}
              channels={syncStatusMore300Setting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={!syncStatusLess300Setting && !syncStatusMore300Setting}
        isCanDelete={
          Boolean(syncStatusLess300UserSetting) ||
          Boolean(syncStatusMore300UserSetting)
        }
      />
    </Grid>
  );
};

export default memo(SyncStatusTab);
