import {
  EAlertType,
  EAlertChannel,
  EAlertValueStatus,
} from "@modules/alerts/enums";

type TAlertSettingBase = {
  id: number;
  channels: EAlertChannel[];
  status: boolean;
};

export type TAlertSettingVotingPower = TAlertSettingBase & {
  value: number;
};

export type TAlertSettingUptime = TAlertSettingBase & {
  value: number;
};

export type TAlertSettingComission = TAlertSettingBase & {
  value: number;
};

export type TAlertSettingJailedStatus = TAlertSettingBase & {
  value: EAlertValueStatus;
};

export type TAlertSettingTombstonedStatus = TAlertSettingBase & {
  value: EAlertValueStatus;
};

export type TAlertSettingBondedStatus = TAlertSettingBase & {
  value: EAlertValueStatus;
};

export type TAlertSettingOtelUpdate = TAlertSettingBase & {
  value: number;
};

export type TAlertSettingSyncStatus = TAlertSettingBase & {
  value: number;
};

export type TAlertSettingsResponse = {
  [EAlertType.VOTING_POWER]: TAlertSettingVotingPower[];
  [EAlertType.UPTIME]: TAlertSettingUptime[];
  [EAlertType.COMISSION]: TAlertSettingComission[];
  [EAlertType.JAILED]: TAlertSettingJailedStatus[];
  [EAlertType.TOMBSTONED]: TAlertSettingTombstonedStatus[];
  [EAlertType.BONDED]: TAlertSettingBondedStatus[];
  [EAlertType.OTEL_UPDATE]: TAlertSettingOtelUpdate[];
  [EAlertType.SYNC_STATUS]: TAlertSettingSyncStatus[];
};

type TUserAlertSettingBase = {
  id: number;
  setting_id: number;
  blockchain_validator_id: number;
  channels: EAlertChannel;
};

export type TUserAlertSettingVotingPower = TUserAlertSettingBase & {};
export type TUserAlertSettingUptime = TUserAlertSettingBase & {};
export type TUserAlertSettingComission = TUserAlertSettingBase & {};
export type TUserAlertSettingJailedStatus = TUserAlertSettingBase & {};
export type TUserAlertSettingTombstonedStatus = TUserAlertSettingBase & {};
export type TUserAlertSettingBondedStatus = TUserAlertSettingBase & {};
export type TUserAlertSettingOtelUpdate = TUserAlertSettingBase & {
  moniker: string;
};
export type TUserAlertSettingSyncStatus = TUserAlertSettingBase & {
  moniker: string;
};

export type TUserAlertSettingsResponse = {
  [EAlertType.VOTING_POWER]: TUserAlertSettingVotingPower[];
  [EAlertType.UPTIME]: TUserAlertSettingUptime[];
  [EAlertType.COMISSION]: TUserAlertSettingComission[];
  [EAlertType.JAILED]: TUserAlertSettingJailedStatus[];
  [EAlertType.TOMBSTONED]: TUserAlertSettingTombstonedStatus[];
  [EAlertType.BONDED]: TUserAlertSettingBondedStatus[];
  [EAlertType.OTEL_UPDATE]: TUserAlertSettingOtelUpdate[];
  [EAlertType.SYNC_STATUS]: TUserAlertSettingSyncStatus[];
};
