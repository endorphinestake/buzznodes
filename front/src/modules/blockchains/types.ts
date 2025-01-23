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

export type TValidatorChart = {
  [key in EValidatorChartType]: {
    [validatorId: string]: [timestamp: string, uptime: string][];
  };
};
