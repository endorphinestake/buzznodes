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

export const formatPingTime = (seconds: number): string => {
  if (seconds < 3) return "Right now";

  const thresholds = [
    { limit: 3, text: "3 Seconds ago" },
    { limit: 6, text: "6 Seconds ago" },
    { limit: 9, text: "9 Seconds ago" },
    { limit: 15, text: "15 Seconds ago" },
    { limit: 30, text: "30 Seconds ago" },
    { limit: 60, text: "more 1 minutes ago" },
    { limit: 300, text: "more 5 minutes ago" },
    { limit: 600, text: "more 10 minutes ago" },
    { limit: 900, text: "more 15 minutes ago" },
    { limit: 1800, text: "more 30 minutes ago" },
    { limit: 3600, text: "more 1 hour ago" },
    { limit: 7200, text: "more 2 hours ago" },
    { limit: 10800, text: "more 3 hours ago" },
    { limit: 14400, text: "more 4 hours ago" },
    { limit: 18000, text: "more 5 hours ago" },
    { limit: 36000, text: "more 10 hours ago" },
    { limit: 54000, text: "more 15 hours ago" },
    { limit: 72000, text: "more 20 hours ago" },
    { limit: 86400, text: "more 1 day ago" },
  ];

  for (let i = 2; i <= 100; i++) {
    thresholds.push({ limit: i * 86400, text: `more ${i} days ago` });
  }

  for (const t of thresholds) {
    if (seconds <= t.limit) return t.text;
  }

  return "more than 100 days ago";
};
