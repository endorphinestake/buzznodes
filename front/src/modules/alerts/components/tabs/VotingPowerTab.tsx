// ** React Imports
import { memo, useEffect, Fragment, ChangeEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";
import { useDomain } from "@context/DomainContext";

// ** Types & Interfaces & Enums Imports
import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
import { TAlertSettingVotingPower } from "@modules/alerts/types";
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
  votingPowerIncreasedSetting: TAlertSettingVotingPower | undefined;
  setVotingPowerIncreasedSetting: (
    value: TAlertSettingVotingPower | undefined
  ) => void;
  votingPowerDecreasedSetting: TAlertSettingVotingPower | undefined;
  setVotingPowerDecreasedSetting: (
    value: TAlertSettingVotingPower | undefined
  ) => void;
  votingPowerIncreasedChannel: EAlertChannel;
  setVotingPowerIncreasedChannel: (value: EAlertChannel) => void;
  votingPowerDecreasedChannel: EAlertChannel;
  setVotingPowerDecreasedChannel: (value: EAlertChannel) => void;
}

const VotingPowerTab = (props: IProps) => {
  // ** Props
  const {
    blockchainValidator,
    votingPowerIncreasedSetting,
    setVotingPowerIncreasedSetting,
    votingPowerDecreasedSetting,
    setVotingPowerDecreasedSetting,
    votingPowerIncreasedChannel,
    setVotingPowerIncreasedChannel,
    votingPowerDecreasedChannel,
    setVotingPowerDecreasedChannel,
  } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { symbol } = useDomain();
  const { dispatch, manageUserAlertSetting, alertSettings, userAlertSettings } =
    useAlertService();

  // ** Vars
  const increasedVotingPowerSettings = alertSettings[EAlertType.VOTING_POWER]
    .filter((item) => item.value > 0)
    .sort((a, b) => a.value - b.value);

  const decreasedVotingPowerSettings = alertSettings[EAlertType.VOTING_POWER]
    .filter((item) => item.value < 0)
    .sort((a, b) => b.value - a.value);

  const votingPowerIncreasedUserSetting = getUserSettingBySettings(
    increasedVotingPowerSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.VOTING_POWER] || []
  );

  const votingPowerDecreasedUserSetting = getUserSettingBySettings(
    decreasedVotingPowerSettings,
    userAlertSettings[blockchainValidator.id]?.[EAlertType.VOTING_POWER] || []
  );

  // ** Handlers
  const handleSaveAlerts = () => {
    let payload = [];
    // Update or Create Increase
    if (votingPowerIncreasedSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_id: votingPowerIncreasedSetting.id,
        user_setting_id: votingPowerIncreasedUserSetting?.id,
        channel: votingPowerIncreasedChannel,
      });
      // Delete Increase
    } else if (votingPowerIncreasedUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_id: votingPowerIncreasedUserSetting.setting_id,
        user_setting_id: votingPowerIncreasedUserSetting.id,
        channel: votingPowerIncreasedUserSetting.channels,
        is_delete: true,
      });
    }

    // Update or Create Decreased
    if (votingPowerDecreasedSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_id: votingPowerDecreasedSetting.id,
        user_setting_id: votingPowerDecreasedUserSetting?.id,
        channel: votingPowerDecreasedChannel,
      });
      // Delete Increase
    } else if (votingPowerDecreasedUserSetting) {
      payload.push({
        blockchain_validator_id: blockchainValidator.id,
        setting_id: votingPowerDecreasedUserSetting.setting_id,
        user_setting_id: votingPowerDecreasedUserSetting.id,
        channel: votingPowerDecreasedUserSetting.channels,
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
    setVotingPowerIncreasedSetting(undefined);
    setVotingPowerDecreasedSetting(undefined);
  };

  const handleDeleteAlerts = () => {
    let payload = [
      votingPowerIncreasedUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_id: votingPowerIncreasedUserSetting.setting_id,
        user_setting_id: votingPowerIncreasedUserSetting.id,
        channel: votingPowerIncreasedUserSetting.channels,
        is_delete: true,
      },
      votingPowerDecreasedUserSetting && {
        blockchain_validator_id: blockchainValidator.id,
        setting_id: votingPowerDecreasedUserSetting.setting_id,
        user_setting_id: votingPowerDecreasedUserSetting.id,
        channel: votingPowerDecreasedUserSetting.channels,
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
      increasedVotingPowerSettings,
      votingPowerIncreasedUserSetting ? [votingPowerIncreasedUserSetting] : []
    );
    setVotingPowerIncreasedSetting(increasedSetting);

    const decreasedSetting = getSettingByUserSettings(
      decreasedVotingPowerSettings,
      votingPowerDecreasedUserSetting ? [votingPowerDecreasedUserSetting] : []
    );
    setVotingPowerDecreasedSetting(decreasedSetting);

    setVotingPowerIncreasedChannel(
      votingPowerIncreasedUserSetting?.channels ||
        increasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );

    setVotingPowerDecreasedChannel(
      votingPowerDecreasedUserSetting?.channels ||
        decreasedSetting?.channels?.[0] ||
        EAlertChannel.SMS
    );
  }, [blockchainValidator]);

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
                  votingPowerIncreasedSetting
                    ? JSON.stringify(votingPowerIncreasedSetting)
                    : ""
                }
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setVotingPowerIncreasedSetting(
                    JSON.parse(event.target.value)
                  );
                }}
              >
                {increasedVotingPowerSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={
                      <Fragment>
                        {Intl.NumberFormat("ru-RU").format(alertSetting.value)}
                        <Chip label={symbol} size="small" disabled />
                      </Fragment>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={votingPowerIncreasedChannel}
              setChannel={setVotingPowerIncreasedChannel}
              channels={votingPowerIncreasedSetting?.channels || []}
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
                value={JSON.stringify(votingPowerDecreasedSetting) || ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setVotingPowerDecreasedSetting(
                    JSON.parse(event.target.value)
                  );
                }}
              >
                {decreasedVotingPowerSettings.map((alertSetting) => (
                  <FormControlLabel
                    key={alertSetting.id}
                    value={JSON.stringify(alertSetting)}
                    control={<Radio disabled={!alertSetting.channels.length} />}
                    label={
                      <Fragment>
                        {Intl.NumberFormat("ru-RU").format(
                          Math.abs(alertSetting.value)
                        )}
                        <Chip label={symbol} size="small" disabled />
                      </Fragment>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <ManageAlertsChannels
              channel={votingPowerDecreasedChannel}
              setChannel={setVotingPowerDecreasedChannel}
              channels={votingPowerDecreasedSetting?.channels || []}
            />
          </CardContent>
        </Card>
      </Grid>

      <ManageAlertsButtons
        handleSaveAlerts={handleSaveAlerts}
        handleClearAlerts={handleClearAlerts}
        handleDeleteAlerts={handleDeleteAlerts}
        isDisabledSave={
          !votingPowerIncreasedSetting && !votingPowerDecreasedSetting
        }
        isCanDelete={
          votingPowerIncreasedUserSetting || votingPowerDecreasedUserSetting
        }
      />
    </Grid>
  );
};

export default memo(VotingPowerTab);
