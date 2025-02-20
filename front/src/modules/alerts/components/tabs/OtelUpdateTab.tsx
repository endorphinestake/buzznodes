// ** React Imports
import { memo, useState, useEffect, Fragment, ChangeEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
import { TAlertSettingOtelUpdate } from "@modules/alerts/types";
import { IManageBridgeUserAlertsTabProps } from "@modules/alerts/interfaces";

// ** Utils Imports
import {
  getSettingByUserSettings,
  getUserSettingBySettings,
} from "@modules/alerts/utils";
import { formatPingTime } from "@modules/shared/utils/text";

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

const OtelUpdateTab = (props: IManageBridgeUserAlertsTabProps) => {
  // ** Props
  const { blockchainBridge, moniker } = props;

  // ** State
  const [otelUpdateLess1MSetting, setOtelUpdateLess1MSetting] = useState<
    TAlertSettingOtelUpdate | undefined
  >(undefined);
  const [otelUpdateMore1MSetting, setOtelUpdateMore1MSetting] = useState<
    TAlertSettingOtelUpdate | undefined
  >(undefined);
  const [otelUpdateLess1MChannel, setOtelUpdateLess1MChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);
  const [otelUpdateMore1MChannel, setOtelUpdateMore1MChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);

  // ** Hooks
  const { t } = useTranslation();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** Vars
  const less1MOtelUpdateSettings = alertSettings[EAlertType.OTEL_UPDATE]
    .filter((item) => item.value <= 1800)
    .sort((a, b) => a.value - b.value);

  const more1MOtelUpdateSettings = alertSettings[EAlertType.OTEL_UPDATE]
    .filter((item) => item.value > 1800)
    .sort((a, b) => a.value - b.value);

  const otelUpdateLess1MUserSetting = getUserSettingBySettings(
    less1MOtelUpdateSettings,
    userAlertSettings[blockchainBridge.id]?.[EAlertType.OTEL_UPDATE] || []
  );

  const otelUpdateMore1MUserSetting = getUserSettingBySettings(
    more1MOtelUpdateSettings,
    userAlertSettings[blockchainBridge.id]?.[EAlertType.OTEL_UPDATE] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    let payload = [];
    // Update or Create Increase
    if (otelUpdateLess1MSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.OTEL_UPDATE,
        setting_id: otelUpdateLess1MSetting.id,
        user_setting_id: otelUpdateLess1MUserSetting?.id,
        channel: otelUpdateLess1MChannel,
        moniker: moniker,
      });
      // Delete Increase
    } else if (otelUpdateLess1MUserSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.OTEL_UPDATE,
        setting_id: otelUpdateLess1MUserSetting.setting_id,
        user_setting_id: otelUpdateLess1MUserSetting.id,
        channel: otelUpdateLess1MUserSetting.channels,
        is_delete: true,
      });
    }

    // Update or Create More1M
    if (otelUpdateMore1MSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.OTEL_UPDATE,
        setting_id: otelUpdateMore1MSetting.id,
        user_setting_id: otelUpdateMore1MUserSetting?.id,
        channel: otelUpdateMore1MChannel,
        moniker: moniker,
      });
      // Delete Increase
    } else if (otelUpdateMore1MUserSetting) {
      payload.push({
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.OTEL_UPDATE,
        setting_id: otelUpdateMore1MUserSetting.setting_id,
        user_setting_id: otelUpdateMore1MUserSetting.id,
        channel: otelUpdateMore1MUserSetting.channels,
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
    setOtelUpdateLess1MSetting(undefined);
    setOtelUpdateMore1MSetting(undefined);
  };

  const handleDeleteAlerts = () => {
    let payload = [
      otelUpdateLess1MUserSetting && {
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.OTEL_UPDATE,
        setting_id: otelUpdateLess1MUserSetting.setting_id,
        user_setting_id: otelUpdateLess1MUserSetting.id,
        channel: otelUpdateLess1MUserSetting.channels,
        is_delete: true,
      },
      otelUpdateMore1MUserSetting && {
        blockchain_bridge_id: blockchainBridge.id,
        setting_type: EAlertType.OTEL_UPDATE,
        setting_id: otelUpdateMore1MUserSetting.setting_id,
        user_setting_id: otelUpdateMore1MUserSetting.id,
        channel: otelUpdateMore1MUserSetting.channels,
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
    const less1MSetting = getSettingByUserSettings(
      less1MOtelUpdateSettings,
      otelUpdateLess1MUserSetting ? [otelUpdateLess1MUserSetting] : []
    );
    setOtelUpdateLess1MSetting(less1MSetting);

    const more1MSetting = getSettingByUserSettings(
      more1MOtelUpdateSettings,
      otelUpdateMore1MUserSetting ? [otelUpdateMore1MUserSetting] : []
    );
    setOtelUpdateMore1MSetting(more1MSetting);

    setOtelUpdateLess1MChannel(
      otelUpdateLess1MUserSetting?.channels ||
        less1MSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );

    setOtelUpdateMore1MChannel(
      otelUpdateMore1MUserSetting?.channels ||
        more1MSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainBridge]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <FormControl>
              <RadioGroup
                value={
                  otelUpdateLess1MSetting
                    ? JSON.stringify(otelUpdateLess1MSetting)
                    : ""
                }
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setOtelUpdateLess1MSetting(JSON.parse(event.target.value));
                }}
              >
                {less1MOtelUpdateSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={t(formatPingTime(alertSetting.value))}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={otelUpdateLess1MChannel}
              setChannel={setOtelUpdateLess1MChannel}
              channels={otelUpdateLess1MSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <FormControl>
              <RadioGroup
                value={JSON.stringify(otelUpdateMore1MSetting) || ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setOtelUpdateMore1MSetting(JSON.parse(event.target.value));
                }}
              >
                {more1MOtelUpdateSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={t(formatPingTime(alertSetting.value))}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={otelUpdateMore1MChannel}
              setChannel={setOtelUpdateMore1MChannel}
              channels={otelUpdateMore1MSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={!otelUpdateLess1MSetting && !otelUpdateMore1MSetting}
        isCanDelete={
          Boolean(otelUpdateLess1MUserSetting) ||
          Boolean(otelUpdateMore1MUserSetting)
        }
      />
    </Grid>
  );
};

export default memo(OtelUpdateTab);
