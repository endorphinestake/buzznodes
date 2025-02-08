// ** React Imports
import { memo, useState, useEffect, Fragment, ChangeEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
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

  // ** State
  const [jailedStatusSetting, setJailedStatusSetting] = useState<
    TAlertSettingJailedStatus | undefined
  >(undefined);
  const [jailedStatusChannel, setJailedStatusChannel] = useState<EAlertChannel>(
    EAlertChannel.SMS
  );
  const [jailedFalseToTrueSetting, setJailedFalseToTrueSetting] =
    useState<boolean>(false);
  const [jailedTrueToFalseSetting, setJailedTrueToFalseSetting] =
    useState<boolean>(false);

  // ** Hooks
  const { t } = useTranslation();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** Vars
  const jailedStatusSettings = alertSettings[EAlertType.JAILED];
  const jailedStatusUserSetting = getUserSettingBySettings(
    jailedStatusSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.JAILED] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    console.log("handleSaveAlerts...");
    // let payload = [];
    // // Update or Create Increase
    // if (comissionIncreasedSetting) {
    //   payload.push({
    //     blockchain_validator_id: blockchainValidator.id,
    //     setting_type: EAlertType.COMISSION,
    //     setting_id: comissionIncreasedSetting.id,
    //     user_setting_id: comissionIncreasedUserSetting?.id,
    //     channel: comissionIncreasedChannel,
    //   });
    //   // Delete Increase
    // } else if (comissionIncreasedUserSetting) {
    //   payload.push({
    //     blockchain_validator_id: blockchainValidator.id,
    //     setting_type: EAlertType.COMISSION,
    //     setting_id: comissionIncreasedUserSetting.setting_id,
    //     user_setting_id: comissionIncreasedUserSetting.id,
    //     channel: comissionIncreasedUserSetting.channels,
    //     is_delete: true,
    //   });
    // }

    // // Update or Create Decreased
    // if (comissionDecreasedSetting) {
    //   payload.push({
    //     blockchain_validator_id: blockchainValidator.id,
    //     setting_type: EAlertType.COMISSION,
    //     setting_id: comissionDecreasedSetting.id,
    //     user_setting_id: comissionDecreasedUserSetting?.id,
    //     channel: comissionDecreasedChannel,
    //   });
    //   // Delete Increase
    // } else if (comissionDecreasedUserSetting) {
    //   payload.push({
    //     blockchain_validator_id: blockchainValidator.id,
    //     setting_type: EAlertType.COMISSION,
    //     setting_id: comissionDecreasedUserSetting.setting_id,
    //     user_setting_id: comissionDecreasedUserSetting.id,
    //     channel: comissionDecreasedUserSetting.channels,
    //     is_delete: true,
    //   });
    // }

    // if (payload.length) {
    //   dispatch(manageUserAlertSetting(payload));
    // } else {
    //   Notify("warning", t(`Parameter not selected!`));
    // }
  };

  const handleClearAlerts = () => {
    setJailedFalseToTrueSetting(false);
    setJailedTrueToFalseSetting(false);
  };

  const handleDeleteAlerts = () => {
    console.log("handleDeleteAlerts...");
    // let payload = [
    //   comissionIncreasedUserSetting && {
    //     blockchain_validator_id: blockchainValidator.id,
    //     setting_type: EAlertType.COMISSION,
    //     setting_id: comissionIncreasedUserSetting.setting_id,
    //     user_setting_id: comissionIncreasedUserSetting.id,
    //     channel: comissionIncreasedUserSetting.channels,
    //     is_delete: true,
    //   },
    //   comissionDecreasedUserSetting && {
    //     blockchain_validator_id: blockchainValidator.id,
    //     setting_type: EAlertType.COMISSION,
    //     setting_id: comissionDecreasedUserSetting.setting_id,
    //     user_setting_id: comissionDecreasedUserSetting.id,
    //     channel: comissionDecreasedUserSetting.channels,
    //     is_delete: true,
    //   },
    // ].filter(Boolean);

    // if (payload.length) {
    //   dispatch(manageUserAlertSetting(payload));
    //   handleClearAlerts();
    // } else {
    //   Notify("warning", t(`Parameter not selected!`));
    // }
  };

  // Event on BlockchainChanged
  useEffect(() => {
    const jailedSetting = getSettingByUserSettings(
      jailedStatusSettings,
      jailedStatusUserSetting ? [jailedStatusUserSetting] : []
    );
    setJailedStatusSetting(jailedSetting);
    setJailedFalseToTrueSetting(
      Boolean(jailedStatusUserSetting?.false_to_true)
    );
    setJailedTrueToFalseSetting(
      Boolean(jailedStatusUserSetting?.true_to_false)
    );
    console.log("jailedStatusUserSetting: ", jailedStatusUserSetting);
    console.log("jailedSetting: ", jailedSetting);
    console.log("jailedStatusSettings: ", jailedStatusSettings);
    console.log(
      "jailed channel: ",
      jailedStatusUserSetting?.channels ||
        jailedSetting?.channels?.[0] ||
        jailedStatusSettings?.[0]?.channels?.[0] ||
        EAlertChannel.SMS
    );
    setJailedStatusChannel(
      jailedStatusUserSetting?.channels ||
        jailedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainValidator]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={t(`When the status changes`)}
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <FormGroup row>
              {jailedStatusSettings.map((alertSetting) => (
                <>
                  {typeof alertSetting.false_to_true === "boolean" && (
                    <FormControlLabel
                      label={t(`from "False" to "True"`)}
                      control={
                        <Switch
                          checked={jailedFalseToTrueSetting}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setJailedFalseToTrueSetting(event.target.checked)
                          }
                          disabled={!alertSetting.false_to_true}
                        />
                      }
                    />
                  )}
                  {typeof alertSetting.true_to_false === "boolean" && (
                    <FormControlLabel
                      label={t(`from "True" to "False"`)}
                      control={
                        <Switch
                          checked={jailedTrueToFalseSetting}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setJailedTrueToFalseSetting(event.target.checked)
                          }
                          disabled={!alertSetting.true_to_false}
                        />
                      }
                    />
                  )}
                </>
              ))}
            </FormGroup>

            <ManageAlertsChannels
              channel={jailedStatusChannel}
              setChannel={setJailedStatusChannel}
              channels={
                jailedStatusSetting?.channels ||
                jailedStatusSettings?.[0]?.channels ||
                []
              }
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={!jailedFalseToTrueSetting && !jailedTrueToFalseSetting}
        isCanDelete={jailedStatusUserSetting}
      />
    </Grid>
  );
};

export default memo(JailedTab);
