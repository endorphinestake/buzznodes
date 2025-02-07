import { EAlertChannel } from "@modules/alerts/enums";

export interface IManageUserAlertSetting {
  blockchain_validator_id: number;
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
}
