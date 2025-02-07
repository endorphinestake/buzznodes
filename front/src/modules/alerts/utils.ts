import { EAlertType } from "@modules/alerts/enums";
import {
  TAlertSettingVotingPower,
  TAlertSettingUptime,
  TAlertSettingComission,
  TAlertSettingJailedStatus,
  TAlertSettingTombstonedStatus,
  TAlertSettingBondedStatus,
  TUserAlertSettingsResponse,
  TUserAlertSettingVotingPower,
  TUserAlertSettingUptime,
  TUserAlertSettingComission,
  TUserAlertSettingJailedStatus,
  TUserAlertSettingTombstonedStatus,
  TUserAlertSettingBondedStatus,
} from "@modules/alerts/types";

type TUserAlertSettingBase =
  | TUserAlertSettingVotingPower
  | TUserAlertSettingUptime
  | TUserAlertSettingComission
  | TUserAlertSettingJailedStatus
  | TUserAlertSettingTombstonedStatus
  | TUserAlertSettingBondedStatus;

type EAlertTypeWithoutAny = Exclude<EAlertType, EAlertType.ANY>;

export const groupByValidatorId = (data: TUserAlertSettingsResponse) => {
  const result: Record<number, Partial<TUserAlertSettingsResponse>> = {};

  Object.entries(data).forEach(([key, alerts]) => {
    (alerts as TUserAlertSettingBase[]).forEach((alert) => {
      const validatorId = alert.blockchain_validator_id;
      if (!result[validatorId]) {
        result[validatorId] = {
          [EAlertType.VOTING_POWER]: [],
          [EAlertType.UPTIME]: [],
          [EAlertType.COMISSION]: [],
          [EAlertType.JAILED]: [],
          [EAlertType.TOMBSTONED]: [],
          [EAlertType.BONDED]: [],
        };
      }

      if (key !== EAlertType.ANY) {
        result[validatorId][key as EAlertTypeWithoutAny] ??= [];
        result[validatorId][key as EAlertTypeWithoutAny]!.push(alert);
      }
    });
  });

  return result;
};

export const getSettingVotingPowerByUserSettings = (
  settings: TAlertSettingVotingPower[],
  userSettings: TUserAlertSettingVotingPower[]
): TAlertSettingVotingPower | undefined => {
  const userSettingIds = userSettings.map((item) => item.setting_id) ?? [];
  return settings.find((setting) => userSettingIds.includes(setting.id));
};
