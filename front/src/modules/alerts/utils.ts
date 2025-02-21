import { EAlertType } from "@modules/alerts/enums";
import {
  TUserAlertSettingsResponse,
  TUserAlertSettingVotingPower,
  TUserAlertSettingUptime,
  TUserAlertSettingComission,
  TUserAlertSettingJailedStatus,
  TUserAlertSettingTombstonedStatus,
  TUserAlertSettingBondedStatus,
  TUserAlertSettingOtelUpdate,
  TUserAlertSettingSyncStatus,
} from "@modules/alerts/types";

type TUserAlertSettingBase =
  | TUserAlertSettingVotingPower
  | TUserAlertSettingUptime
  | TUserAlertSettingComission
  | TUserAlertSettingJailedStatus
  | TUserAlertSettingTombstonedStatus
  | TUserAlertSettingBondedStatus
  | TUserAlertSettingOtelUpdate
  | TUserAlertSettingSyncStatus;

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
          [EAlertType.OTEL_UPDATE]: [],
          [EAlertType.SYNC_STATUS]: [],
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

export const getRowsFromAlerts = (
  data: Record<number, Partial<TUserAlertSettingsResponse>>
): Array<{
  id: string;
  VOTING_POWER: TUserAlertSettingBase[];
  UPTIME: TUserAlertSettingBase[];
  COMISSION: TUserAlertSettingBase[];
  JAILED: TUserAlertSettingBase[];
  TOMBSTONED: TUserAlertSettingBase[];
  BONDED: TUserAlertSettingBase[];
  OTEL_UPDATE: TUserAlertSettingBase[];
  SYNC_STATUS: TUserAlertSettingBase[];
}> => {
  return Object.entries(data).map(([validatorId, alerts]) => ({
    id: validatorId,
    VOTING_POWER: alerts.VOTING_POWER ?? [],
    UPTIME: alerts.UPTIME ?? [],
    COMISSION: alerts.COMISSION ?? [],
    JAILED: alerts.JAILED ?? [],
    TOMBSTONED: alerts.TOMBSTONED ?? [],
    BONDED: alerts.BONDED ?? [],
    OTEL_UPDATE: alerts.OTEL_UPDATE ?? [],
    SYNC_STATUS: alerts.SYNC_STATUS ?? [],
  }));
};

export const getSettingByUserSettings = <
  TSetting extends { id: number },
  TUserSetting extends { setting_id: number }
>(
  settings: TSetting[],
  userSettings: TUserSetting[]
): TSetting | undefined => {
  const userSettingIds = userSettings.map((item) => item.setting_id);
  const found = settings.find((setting) => userSettingIds.includes(setting.id));
  return found;
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
