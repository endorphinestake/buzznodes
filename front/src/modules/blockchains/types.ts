import {
  EBlockchainValidatorStatus,
  EValidatorChartType,
} from "@modules/blockchains/enums";

export type TBlockchainValidator = {
  id: number;
  blockchain_id: number;
  operator_address: string;
  moniker?: string;
  picture?: string;
  voting_power: number;
  commision_rate: number;
  uptime: number;
  status: EBlockchainValidatorStatus;
  updated: Date;
  rank: number;
  voting_power_percentage: number;
};

export type TBlockchainValidatorDetail = TBlockchainValidator & {
  pubkey_type: string;
  pubkey_key: string;
  identity?: string;
  website?: string;
  contact?: string;
  details?: string;
  commision_max_rate: number;
  commision_max_change_rate: number;
  missed_blocks_counter: number;
  hex_address?: string;
  valcons_address?: string;
  wallet_address?: string;
  jailed: boolean;
  tombstoned: boolean;
};

export type TValidatorChart = {
  [key in EValidatorChartType]: {
    [validatorId: string]: [timestamp: string, uptime: string][];
  };
};
