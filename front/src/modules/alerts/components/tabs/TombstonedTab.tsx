// ** React Imports
import { memo, useState, useEffect, ChangeEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import {
  EAlertChannel,
  EAlertType,
  EAlertValueStatus,
} from "@modules/alerts/enums";
import { TAlertSettingTombstonedStatus } from "@modules/alerts/types";
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
  Switch,
  FormGroup,
  FormControlLabel,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

const TombstonedTab = (props: IManageUserAlertsTabProps) => {
  // ** Props
  const { blockchainValidator } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** State
  const [tombstonedFalseToTrueSetting, setTombstonedFalseToTrueSetting] =
    useState<TAlertSettingTombstonedStatus | undefined>(undefined);
  const [tombstonedFalseToTrueChannel, setTombstonedFalseToTrueChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);

  // ** Vars
  const falseToTrueTombstonedSettings = alertSettings[
    EAlertType.TOMBSTONED
  ].filter((item) => item.value === EAlertValueStatus.FALSE_TO_TRUE);

  const tombstonedFalseToTrueUserSetting = getUserSettingBySettings(
    falseToTrueTombstonedSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.TOMBSTONED] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    let payload = [];
    // Update or Create FalseToTrue
    if (tombstonedFalseToTrueSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.TOMBSTONED,
        setting_id: tombstonedFalseToTrueSetting.id,
        user_setting_id: tombstonedFalseToTrueUserSetting?.id,
        channel: tombstonedFalseToTrueChannel,
      });
      // Delete Increase
    } else if (tombstonedFalseToTrueUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.TOMBSTONED,
        setting_id: tombstonedFalseToTrueUserSetting.setting_id,
        user_setting_id: tombstonedFalseToTrueUserSetting.id,
        channel: tombstonedFalseToTrueUserSetting.channels,
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
    setTombstonedFalseToTrueSetting(undefined);
  };

  const handleDeleteAlerts = () => {
    let payload = [
      tombstonedFalseToTrueUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.TOMBSTONED,
        setting_id: tombstonedFalseToTrueUserSetting.setting_id,
        user_setting_id: tombstonedFalseToTrueUserSetting.id,
        channel: tombstonedFalseToTrueUserSetting.channels,
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
    const falseToTrueSetting = getSettingByUserSettings(
      falseToTrueTombstonedSettings,
      tombstonedFalseToTrueUserSetting ? [tombstonedFalseToTrueUserSetting] : []
    );
    setTombstonedFalseToTrueSetting(falseToTrueSetting);
    setTombstonedFalseToTrueChannel(
      tombstonedFalseToTrueUserSetting?.channels ||
        falseToTrueSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainValidator]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`On tombstoned status change`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormGroup row>
              {falseToTrueTombstonedSettings.map((alertSetting) => (
                <FormControlLabel
                  key={alertSetting.id}
                  label={t(`from "False" to "True"`)}
                  control={
                    <Switch
                      checked={Boolean(tombstonedFalseToTrueSetting)}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setTombstonedFalseToTrueSetting(
                          event.target.checked ? alertSetting : undefined
                        );
                      }}
                      disabled={!alertSetting.channels.length}
                    />
                  }
                />
              ))}
            </FormGroup>

            <ManageAlertsChannels
              channel={tombstonedFalseToTrueChannel}
              setChannel={setTombstonedFalseToTrueChannel}
              channels={tombstonedFalseToTrueSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={!tombstonedFalseToTrueSetting}
        isCanDelete={Boolean(tombstonedFalseToTrueUserSetting)}
        isHideClear={true}
      />
    </Grid>
  );
};

export default memo(TombstonedTab);
