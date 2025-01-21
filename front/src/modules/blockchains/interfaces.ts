import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";
import { TBlockchainValidator } from "@modules/blockchains/types";

export interface IBlockchainValidatorsFilter {
  blockchain_id: number;
  status?: EBlockchainValidatorStatus;
}

export interface IValidatorsTableRow {
  row: TBlockchainValidator;
}

export interface IValidatorsTableProps {
  validators: TBlockchainValidator[];
  status: EBlockchainValidatorStatus;
  onAlertEdit: (c: TBlockchainValidator) => void;
}
