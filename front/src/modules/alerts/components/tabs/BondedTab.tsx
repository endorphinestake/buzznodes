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
import { TAlertSettingBondedStatus } from "@modules/alerts/types";
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

const BondedTab = (props: IManageUserAlertsTabProps) => {
  // ** Props
  const { blockchainValidator } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** State
  const [bondedFalseToTrueSetting, setBondedFalseToTrueSetting] = useState<
    TAlertSettingBondedStatus | undefined
  >(undefined);
  const [bondedTrueToFalseSetting, setBondedTrueToFalseSetting] = useState<
    TAlertSettingBondedStatus | undefined
  >(undefined);
  const [bondedFalseToTrueChannel, setBondedFalseToTrueChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);
  const [bondedTrueToFalseChannel, setBondedTrueToFalseChannel] =
    useState<EAlertChannel>(EAlertChannel.SMS);

  // ** Vars
  const falseToTrueBondedSettings = alertSettings[EAlertType.BONDED].filter(
    (item) => item.value === EAlertValueStatus.FALSE_TO_TRUE
  );

  const trueToFalseBondedSettings = alertSettings[EAlertType.BONDED].filter(
    (item) => item.value === EAlertValueStatus.TRUE_TO_FALSE
  );

  const bondedFalseToTrueUserSetting = getUserSettingBySettings(
    falseToTrueBondedSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.BONDED] || []
  );

  const bondedTrueToFalseUserSetting = getUserSettingBySettings(
    trueToFalseBondedSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.BONDED] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    let payload = [];
    // Update or Create FalseToTrue
    if (bondedFalseToTrueSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.BONDED,
        setting_id: bondedFalseToTrueSetting.id,
        user_setting_id: bondedFalseToTrueUserSetting?.id,
        channel: bondedFalseToTrueChannel,
      });
      // Delete Increase
    } else if (bondedFalseToTrueUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.BONDED,
        setting_id: bondedFalseToTrueUserSetting.setting_id,
        user_setting_id: bondedFalseToTrueUserSetting.id,
        channel: bondedFalseToTrueUserSetting.channels,
        is_delete: true,
      });
    }

    // Update or Create TrueToFalse
    if (bondedTrueToFalseSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.BONDED,
        setting_id: bondedTrueToFalseSetting.id,
        user_setting_id: bondedTrueToFalseUserSetting?.id,
        channel: bondedTrueToFalseChannel,
      });
      // Delete Increase
    } else if (bondedTrueToFalseUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.BONDED,
        setting_id: bondedTrueToFalseUserSetting.setting_id,
        user_setting_id: bondedTrueToFalseUserSetting.id,
        channel: bondedTrueToFalseUserSetting.channels,
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
    setBondedFalseToTrueSetting(false);
    setBondedTrueToFalseSetting(false);
  };

  const handleDeleteAlerts = () => {
    let payload = [
      bondedFalseToTrueUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.BONDED,
        setting_id: bondedFalseToTrueUserSetting.setting_id,
        user_setting_id: bondedFalseToTrueUserSetting.id,
        channel: bondedFalseToTrueUserSetting.channels,
        is_delete: true,
      },
      bondedTrueToFalseUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_type: EAlertType.BONDED,
        setting_id: bondedTrueToFalseUserSetting.setting_id,
        user_setting_id: bondedTrueToFalseUserSetting.id,
        channel: bondedTrueToFalseUserSetting.channels,
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
      falseToTrueBondedSettings,
      bondedFalseToTrueUserSetting ? [bondedFalseToTrueUserSetting] : []
    );
    setBondedFalseToTrueSetting(falseToTrueSetting);

    const trueToFalseSetting = getSettingByUserSettings(
      trueToFalseBondedSettings,
      bondedTrueToFalseUserSetting ? [bondedTrueToFalseUserSetting] : []
    );
    setBondedTrueToFalseSetting(trueToFalseSetting);

    setBondedFalseToTrueChannel(
      bondedFalseToTrueUserSetting?.channels ||
        falseToTrueSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );

    setBondedTrueToFalseChannel(
      bondedTrueToFalseUserSetting?.channels ||
        trueToFalseSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainValidator]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`When the Bond status changed`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormGroup row>
              {falseToTrueBondedSettings.map((alertSetting) => (
                <FormControlLabel
                  key={alertSetting.id}
                  label={t(`from "False" to "True"`)}
                  control={
                    <Switch
                      checked={Boolean(bondedFalseToTrueSetting)}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setBondedFalseToTrueSetting(
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
              channel={bondedFalseToTrueChannel}
              setChannel={setBondedFalseToTrueChannel}
              channels={bondedFalseToTrueSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`When the Bond status changed`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormGroup row>
              {trueToFalseBondedSettings.map((alertSetting) => (
                <FormControlLabel
                  key={alertSetting.id}
                  label={t(`from "True" to "False"`)}
                  control={
                    <Switch
                      checked={Boolean(bondedTrueToFalseSetting)}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setBondedTrueToFalseSetting(
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
              channel={bondedTrueToFalseChannel}
              setChannel={setBondedTrueToFalseChannel}
              channels={bondedTrueToFalseSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={!bondedFalseToTrueSetting && !bondedTrueToFalseSetting}
        isCanDelete={
          bondedFalseToTrueUserSetting || bondedTrueToFalseUserSetting
        }
        isHideClear={true}
      />
    </Grid>
  );
};

export default memo(BondedTab);
