import { EAlertType, EAlertChannel } from "@modules/alerts/enums";

type TAlertSettingBase = {
  id: number;
  channels: EAlertChannel[];
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
  false_to_true: boolean;
  true_to_false: boolean;
};

export type TAlertSettingTombstonedStatus = TAlertSettingBase & {
  false_to_true: boolean;
};

export type TAlertSettingBondedStatus = TAlertSettingBase & {
  false_to_true: boolean;
  true_to_false: boolean;
};

export type TAlertSettingsResponse = {
  [EAlertType.VOTING_POWER]: TAlertSettingVotingPower[];
  [EAlertType.UPTIME]: TAlertSettingUptime[];
  [EAlertType.COMISSION]: TAlertSettingComission[];
  [EAlertType.JAILED]: TAlertSettingJailedStatus[];
  [EAlertType.TOMBSTONED]: TAlertSettingTombstonedStatus[];
  [EAlertType.BONDED]: TAlertSettingBondedStatus[];
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

export type TUserAlertSettingsResponse = {
  [EAlertType.VOTING_POWER]: TUserAlertSettingVotingPower[];
  [EAlertType.UPTIME]: TUserAlertSettingUptime[];
  [EAlertType.COMISSION]: TUserAlertSettingComission[];
  [EAlertType.JAILED]: TUserAlertSettingJailedStatus[];
  [EAlertType.TOMBSTONED]: TUserAlertSettingTombstonedStatus[];
  [EAlertType.BONDED]: TUserAlertSettingBondedStatus[];
};
