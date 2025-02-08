import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
import { TBlockchainValidator } from "@modules/blockchains/types";

export interface IManageUserAlertSetting {
  blockchain_validator_id: number;
  setting_type: EAlertType;
  setting_id: number;
  user_setting_id?: number;
  channel: EAlertChannel;
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
