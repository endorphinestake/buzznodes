import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
import {
  TAlertHistory,
  TAlertSettingsResponse,
  TUserAlertSettingsResponse,
} from "@modules/alerts/types";
import {
  TBlockchainValidator,
  TBlockchainBridge,
} from "@modules/blockchains/types";

export interface IUserAlertSettingsFilter {
  blockchainId: number;
}

export interface IManageUserAlertSetting {
  blockchain_validator_id: number;
  setting_type: EAlertType;
  setting_id: number;
  user_setting_id?: number;
  channel: EAlertChannel;
  moniker?: string;
  is_delete: boolean;
}

export interface IManageUserAlertsButtonProps {
  handleSaveAlerts: () => void;
  handleClearAlerts: () => void;
  handleDeleteAlerts: () => void;
  isDisabledSave: boolean;
  isCanDelete: boolean;
  isHideClear?: boolean;
}

export interface IManageUserAlertsTabProps {
  blockchainValidator: TBlockchainValidator;
}

export interface IManageBridgeUserAlertsTabProps {
  blockchainBridge: TBlockchainBridge;
  moniker: string;
}

export interface IAlertsTableProps {
  alertSettings: TAlertSettingsResponse;
  userAlertSettings: Record<number, Partial<TUserAlertSettingsResponse>>;
  validators: TBlockchainValidator[];
  bridges: TBlockchainBridge[];
}

export interface IAlertHistoryTableProps {
  histories: TAlertHistory[];
}

export interface IAlertsTableRow {
  row: any;
}

export interface IAlertsHistoryTableRow {
  row: TAlertHistory;
}
