import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";

export type TBlockchainValidator = {
  id: number;
  blockchain_id: number;
  operator_address: string;
  moniker?: string;
  identity?: string;
  voting_power: number;
  commision_rate: number;
  uptime: number;
  status: EBlockchainValidatorStatus;
  updated: Date;
};
