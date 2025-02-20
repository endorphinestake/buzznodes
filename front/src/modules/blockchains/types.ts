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
  tombstoned: boolean;
  status: EBlockchainValidatorStatus;
  updated: Date;
  rank: number;
  voting_power_percentage: number;
};

export type TBlockchainValidators = {
  network_height: number;
  validators: TBlockchainValidator[];
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

export type TBlockchainBridge = {
  id: number;
  blockchain_id: number;
  node_id: string;
  version: string;
  system_version: string;
  node_height: number;
  node_height_diff: number;
  last_timestamp: number;
  last_timestamp_diff: number;
  rank: number;
};

export type TBlockchainBridges = {
  network_height: number;
  bridges: TBlockchainBridge[];
};
