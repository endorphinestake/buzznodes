// ** React Imports
import { memo, useEffect, Fragment, ChangeEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
import { TAlertSettingUptime } from "@modules/alerts/types";
import { TBlockchainValidator } from "@modules/blockchains/types";

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

interface IProps {
  blockchainValidator: TBlockchainValidator;
  uptimeIncreasedSetting: TAlertSettingUptime | undefined;
  setUptimeIncreasedSetting: (value: TAlertSettingUptime | undefined) => void;
  uptimeDecreasedSetting: TAlertSettingUptime | undefined;
  setUptimeDecreasedSetting: (value: TAlertSettingUptime | undefined) => void;
  uptimeIncreasedChannel: EAlertChannel;
  setUptimeIncreasedChannel: (value: EAlertChannel) => void;
  uptimeDecreasedChannel: EAlertChannel;
  setUptimeDecreasedChannel: (value: EAlertChannel) => void;
}

const UptimeTab = (props: IProps) => {
  // ** Props
  const {
    blockchainValidator,
    uptimeIncreasedSetting,
    setUptimeIncreasedSetting,
    uptimeDecreasedSetting,
    setUptimeDecreasedSetting,
    uptimeIncreasedChannel,
    setUptimeIncreasedChannel,
    uptimeDecreasedChannel,
    setUptimeDecreasedChannel,
  } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** Vars
  const increasedUptimeSettings = alertSettings[EAlertType.UPTIME]
    .filter((item) => item.value > 0)
    .sort((a, b) => a.value - b.value);

  const decreasedUptimeSettings = alertSettings[EAlertType.UPTIME]
    .filter((item) => item.value < 0)
    .sort((a, b) => b.value - a.value);

  const uptimeIncreasedUserSetting = getUserSettingBySettings(
    increasedUptimeSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.UPTIME] || []
  );

  const uptimeDecreasedUserSetting = getUserSettingBySettings(
    decreasedUptimeSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.UPTIME] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    let payload = [];
    // Update or Create Increase
    if (uptimeIncreasedSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.UPTIME,
        setting_id: uptimeIncreasedSetting.id,
        user_setting_id: uptimeIncreasedUserSetting?.id,
        channel: uptimeIncreasedChannel,
      });
      // Delete Increase
    } else if (uptimeIncreasedUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.UPTIME,
        setting_id: uptimeIncreasedUserSetting.setting_id,
        user_setting_id: uptimeIncreasedUserSetting.id,
        channel: uptimeIncreasedUserSetting.channels,
        is_delete: true,
      });
    }

    // Update or Create Decreased
    if (uptimeDecreasedSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.UPTIME,
        setting_id: uptimeDecreasedSetting.id,
        user_setting_id: uptimeDecreasedUserSetting?.id,
        channel: uptimeDecreasedChannel,
      });
      // Delete Increase
    } else if (uptimeDecreasedUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.UPTIME,
        setting_id: uptimeDecreasedUserSetting.setting_id,
        user_setting_id: uptimeDecreasedUserSetting.id,
        channel: uptimeDecreasedUserSetting.channels,
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
    setUptimeIncreasedSetting(undefined);
    setUptimeDecreasedSetting(undefined);
  };

  const handleDeleteAlerts = () => {
    let payload = [
      uptimeIncreasedUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.UPTIME,
        setting_id: uptimeIncreasedUserSetting.setting_id,
        user_setting_id: uptimeIncreasedUserSetting.id,
        channel: uptimeIncreasedUserSetting.channels,
        is_delete: true,
      },
      uptimeDecreasedUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.UPTIME,
        setting_id: uptimeDecreasedUserSetting.setting_id,
        user_setting_id: uptimeDecreasedUserSetting.id,
        channel: uptimeDecreasedUserSetting.channels,
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
      increasedUptimeSettings,
      uptimeIncreasedUserSetting ? [uptimeIncreasedUserSetting] : []
    );
    setUptimeIncreasedSetting(increasedSetting);

    const decreasedSetting = getSettingByUserSettings(
      decreasedUptimeSettings,
      uptimeDecreasedUserSetting ? [uptimeDecreasedUserSetting] : []
    );
    setUptimeDecreasedSetting(decreasedSetting);

    setUptimeIncreasedChannel(
      uptimeIncreasedUserSetting?.channels ||
        increasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );

    setUptimeDecreasedChannel(
      uptimeDecreasedUserSetting?.channels ||
        decreasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainValidator]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`When the value has increased to`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormControl>
              <RadioGroup
                value={
                  uptimeIncreasedSetting
                    ? JSON.stringify(uptimeIncreasedSetting)
                    : ""
                }
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setUptimeIncreasedSetting(JSON.parse(event.target.value));
                }}
              >
                {increasedUptimeSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={
                      <Fragment>
                        {(100 - alertSetting.value).toFixed(2)}
                        <Chip label="%" size="small" disabled />
                      </Fragment>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={uptimeIncreasedChannel}
              setChannel={setUptimeIncreasedChannel}
              channels={uptimeIncreasedSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`When the value has decreased to`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormControl>
              <RadioGroup
                value={JSON.stringify(uptimeDecreasedSetting) || ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setUptimeDecreasedSetting(JSON.parse(event.target.value));
                }}
              >
                {decreasedUptimeSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={
                      <Fragment>
                        {(100 - Math.abs(alertSetting.value)).toFixed(2)}
                        <Chip label="%" size="small" disabled />
                      </Fragment>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={uptimeDecreasedChannel}
              setChannel={setUptimeDecreasedChannel}
              channels={uptimeDecreasedSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={!uptimeIncreasedSetting && !uptimeDecreasedSetting}
        isCanDelete={uptimeIncreasedUserSetting || uptimeDecreasedUserSetting}
      />
    </Grid>
  );
};

export default memo(UptimeTab);
