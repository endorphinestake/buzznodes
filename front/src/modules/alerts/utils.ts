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

export const getSettingByUserSettings = <
  TSetting extends { id: number },
  TUserSetting extends { setting_id: number }
>(
  settings: TSetting[],
  userSettings: TUserSetting[]
): TSetting | undefined => {
  const userSettingIds = userSettings.map((item) => item.setting_id);
  return settings.find((setting) => userSettingIds.includes(setting.id));
};

export const getUserSettingBySettings = <
  TSetting extends { id: number },
  TUserSetting extends { setting_id: number }
>(
  settings: TSetting[],
  userSettings: TUserSetting[]
): TUserSetting | undefined => {
  const settingIds = settings.map((item) => item.id);
  return userSettings.find((userSetting) =>
    settingIds.includes(userSetting.setting_id)
  );
};

// export const getUserSettingBySettingId = <TSetting extends { id: number }>(
//   settings: TSetting[],
//   settingId: number
// ): TSetting | undefined => {
//   return settings.find((setting) => setting.id === settingId);
// };

// export const getUserSettingBySettingId = <TSetting extends { id: number }>(
//   settings: TSetting[],
//   settingId: number
// ): TSetting | undefined => {
//   return settings.find((setting) => setting.id === settingId);
// };
