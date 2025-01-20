import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";

export interface IBlockchainValidatorsFilter {
  blockchain_id: number;
  status?: EBlockchainValidatorStatus;
}
