// ** React Imports
import { memo, useState, useEffect, Fragment, ChangeEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
import { TAlertSettingComission } from "@modules/alerts/types";
import { IManageUserAlertsTabProps } from "@modules/alerts/interfaces";

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

const ComissisionTab = (props: IManageUserAlertsTabProps) => {
  // ** Props
  const { blockchainValidator } = props;

  // ** State
  const [comissionIncreasedSetting, setComissionIncreasedSetting] = useState<
    TAlertSettingComission | undefined
  >(undefined);
  const [comissionDecreasedSetting, setComissionDecreasedSetting] = useState<
    TAlertSettingComission | undefined
  >(undefined);
  const [comissionIncreasedChannel, setComissionIncreasedChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);
  const [comissionDecreasedChannel, setComissionDecreasedChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);

  // ** Hooks
  const { t } = useTranslation();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** Vars
  const increasedComissionSettings = alertSettings[EAlertType.COMISSION]
    .filter((item) => item.value > 0)
    .sort((a, b) => a.value - b.value);

  const decreasedComissionSettings = alertSettings[EAlertType.COMISSION]
    .filter((item) => item.value < 0)
    .sort((a, b) => b.value - a.value);

  const comissionIncreasedUserSetting = getUserSettingBySettings(
    increasedComissionSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.COMISSION] || []
  );

  const comissionDecreasedUserSetting = getUserSettingBySettings(
    decreasedComissionSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.COMISSION] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    let payload = [];
    // Update or Create Increase
    if (comissionIncreasedSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.COMISSION,
        setting_id: comissionIncreasedSetting.id,
        user_setting_id: comissionIncreasedUserSetting?.id,
        channel: comissionIncreasedChannel,
      });
      // Delete Increase
    } else if (comissionIncreasedUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.COMISSION,
        setting_id: comissionIncreasedUserSetting.setting_id,
        user_setting_id: comissionIncreasedUserSetting.id,
        channel: comissionIncreasedUserSetting.channels,
        is_delete: true,
      });
    }

    // Update or Create Decreased
    if (comissionDecreasedSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.COMISSION,
        setting_id: comissionDecreasedSetting.id,
        user_setting_id: comissionDecreasedUserSetting?.id,
        channel: comissionDecreasedChannel,
      });
      // Delete Increase
    } else if (comissionDecreasedUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.COMISSION,
        setting_id: comissionDecreasedUserSetting.setting_id,
        user_setting_id: comissionDecreasedUserSetting.id,
        channel: comissionDecreasedUserSetting.channels,
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
    setComissionIncreasedSetting(undefined);
    setComissionDecreasedSetting(undefined);
  };

  const handleDeleteAlerts = () => {
    let payload = [
      comissionIncreasedUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.COMISSION,
        setting_id: comissionIncreasedUserSetting.setting_id,
        user_setting_id: comissionIncreasedUserSetting.id,
        channel: comissionIncreasedUserSetting.channels,
        is_delete: true,
      },
      comissionDecreasedUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.COMISSION,
        setting_id: comissionDecreasedUserSetting.setting_id,
        user_setting_id: comissionDecreasedUserSetting.id,
        channel: comissionDecreasedUserSetting.channels,
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
      increasedComissionSettings,
      comissionIncreasedUserSetting ? [comissionIncreasedUserSetting] : []
    );
    setComissionIncreasedSetting(increasedSetting);

    const decreasedSetting = getSettingByUserSettings(
      decreasedComissionSettings,
      comissionDecreasedUserSetting ? [comissionDecreasedUserSetting] : []
    );
    setComissionDecreasedSetting(decreasedSetting);

    setComissionIncreasedChannel(
      comissionIncreasedUserSetting?.channels ||
        increasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );

    setComissionDecreasedChannel(
      comissionDecreasedUserSetting?.channels ||
        decreasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainValidator]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`When the Comission increases`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormControl>
              <RadioGroup
                value={
                  comissionIncreasedSetting
                    ? JSON.stringify(comissionIncreasedSetting)
                    : ""
                }
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setComissionIncreasedSetting(JSON.parse(event.target.value));
                }}
              >
                {increasedComissionSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={
                      <Fragment>
                        {alertSetting.value * 100}
                        <Chip label="%" size="small" disabled />
                      </Fragment>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={comissionIncreasedChannel}
              setChannel={setComissionIncreasedChannel}
              channels={comissionIncreasedSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`When the Comission decreases`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormControl>
              <RadioGroup
                value={JSON.stringify(comissionDecreasedSetting) || ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setComissionDecreasedSetting(JSON.parse(event.target.value));
                }}
              >
                {decreasedComissionSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={
                      <Fragment>
                        {Math.abs(alertSetting.value * 100)}
                        <Chip label="%" size="small" disabled />
                      </Fragment>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={comissionDecreasedChannel}
              setChannel={setComissionDecreasedChannel}
              channels={comissionDecreasedSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={
          !comissionIncreasedSetting && !comissionDecreasedSetting
        }
        isCanDelete={
          Boolean(comissionIncreasedUserSetting) ||
          Boolean(comissionDecreasedUserSetting)
        }
      />
    </Grid>
  );
};

export default memo(ComissisionTab);
