// ** React Imports
import { memo, useState, useEffect, Fragment, ChangeEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import {
  EAlertChannel,
  EAlertType,
  EAlertValueStatus,
} from "@modules/alerts/enums";
import { TAlertSettingJailedStatus } from "@modules/alerts/types";
import { TBlockchainValidator } from "@modules/blockchains/types";
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
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Grid,
  Chip,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

const JailedTab = (props: IManageUserAlertsTabProps) => {
  // ** Props
  const { blockchainValidator } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** State
  const [jailedFalseToTrueSetting, setJailedFalseToTrueSetting] = useState<
    TAlertSettingJailedStatus | undefined
  >(undefined);
  const [jailedTrueToFalseSetting, setJailedTrueToFalseSetting] = useState<
    TAlertSettingJailedStatus | undefined
  >(undefined);
  const [jailedFalseToTrueChannel, setJailedFalseToTrueChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);
  const [jailedTrueToFalseChannel, setJailedTrueToFalseChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);

  // ** Vars
  const falseToTrueJailedSettings = alertSettings[EAlertType.JAILED].filter(
    (item) => item.value === EAlertValueStatus.FALSE_TO_TRUE
  );

  const trueToFalseJailedSettings = alertSettings[EAlertType.JAILED].filter(
    (item) => item.value === EAlertValueStatus.TRUE_TO_FALSE
  );

  const jailedFalseToTrueUserSetting = getUserSettingBySettings(
    falseToTrueJailedSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.JAILED] || []
  );

  const jailedTrueToFalseUserSetting = getUserSettingBySettings(
    trueToFalseJailedSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.JAILED] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    let payload = [];
    // Update or Create FalseToTrue
    if (jailedFalseToTrueSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.JAILED,
        setting_id: jailedFalseToTrueSetting.id,
        user_setting_id: jailedFalseToTrueUserSetting?.id,
        channel: jailedFalseToTrueChannel,
      });
      // Delete Increase
    } else if (jailedFalseToTrueUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.JAILED,
        setting_id: jailedFalseToTrueUserSetting.setting_id,
        user_setting_id: jailedFalseToTrueUserSetting.id,
        channel: jailedFalseToTrueUserSetting.channels,
        is_delete: true,
      });
    }

    // Update or Create TrueToFalse
    if (jailedTrueToFalseSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.JAILED,
        setting_id: jailedTrueToFalseSetting.id,
        user_setting_id: jailedTrueToFalseUserSetting?.id,
        channel: jailedTrueToFalseChannel,
      });
      // Delete Increase
    } else if (jailedTrueToFalseUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.JAILED,
        setting_id: jailedTrueToFalseUserSetting.setting_id,
        user_setting_id: jailedTrueToFalseUserSetting.id,
        channel: jailedTrueToFalseUserSetting.channels,
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
    setJailedFalseToTrueSetting(false);
    setJailedTrueToFalseSetting(false);
  };

  const handleDeleteAlerts = () => {
    let payload = [
      jailedFalseToTrueUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.JAILED,
        setting_id: jailedFalseToTrueUserSetting.setting_id,
        user_setting_id: jailedFalseToTrueUserSetting.id,
        channel: jailedFalseToTrueUserSetting.channels,
        is_delete: true,
      },
      jailedTrueToFalseUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.JAILED,
        setting_id: jailedTrueToFalseUserSetting.setting_id,
        user_setting_id: jailedTrueToFalseUserSetting.id,
        channel: jailedTrueToFalseUserSetting.channels,
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
      falseToTrueJailedSettings,
      jailedFalseToTrueUserSetting ? [jailedFalseToTrueUserSetting] : []
    );
    setJailedFalseToTrueSetting(falseToTrueSetting);

    const trueToFalseSetting = getSettingByUserSettings(
      trueToFalseJailedSettings,
      jailedTrueToFalseUserSetting ? [jailedTrueToFalseUserSetting] : []
    );
    setJailedTrueToFalseSetting(trueToFalseSetting);

    setJailedFalseToTrueChannel(
      jailedFalseToTrueUserSetting?.channels ||
        falseToTrueSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );

    setJailedTrueToFalseChannel(
      jailedTrueToFalseUserSetting?.channels ||
        trueToFalseSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainValidator]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <FormGroup row>
              {falseToTrueJailedSettings.map((alertSetting) => (
                <FormControlLabel
                  key={alertSetting.id}
                  label={t(`from "False" to "True"`)}
                  control={
                    <Switch
                      checked={Boolean(jailedFalseToTrueSetting)}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setJailedFalseToTrueSetting(
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
              channel={jailedFalseToTrueChannel}
              setChannel={setJailedFalseToTrueChannel}
              channels={jailedFalseToTrueSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardContent>
            <FormGroup row>
              {trueToFalseJailedSettings.map((alertSetting) => (
                <FormControlLabel
                  key={alertSetting.id}
                  label={t(`from "True" to "False"`)}
                  control={
                    <Switch
                      checked={Boolean(jailedTrueToFalseSetting)}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setJailedTrueToFalseSetting(
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
              channel={jailedTrueToFalseChannel}
              setChannel={setJailedTrueToFalseChannel}
              channels={jailedTrueToFalseSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={!jailedFalseToTrueSetting && !jailedTrueToFalseSetting}
        isCanDelete={
          jailedFalseToTrueUserSetting || jailedTrueToFalseUserSetting
        }
        isHideClear={true}
      />
    </Grid>
  );
};

export default memo(JailedTab);
