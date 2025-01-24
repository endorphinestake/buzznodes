import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";
import { TBlockchainValidator } from "@modules/blockchains/types";

export interface IBlockchainValidatorsFilter {
  blockchain_id: number;
  status?: EBlockchainValidatorStatus;
}

export interface IValidatorChartsFilter {
  validator_ids: number[];
  date_start?: Date;
  date_end?: Date;
}

export interface IValidatorsTableRow {
  row: TBlockchainValidator;
}

export interface IValidatorsTableProps {
  validators: TBlockchainValidator[];
  status: EBlockchainValidatorStatus;
  onAlertEdit: (c: TBlockchainValidator) => void;
}

export interface ISelectValidatorsProps {
  value?: TBlockchainValidator;
  values?: TBlockchainValidator[];
  setValue?: (value: TBlockchainValidator) => void;
  setValues?: (value: TBlockchainValidator[]) => void;
  label?: string;
  size?: "small" | "medium";
}

export interface IValidatorChartProps {
  chartTitle: string;
  data: {
    [validatorId: string]: [timestamp: string, uptime: string][];
  };
  monikers: Record<string, { moniker: string; color: string }>;
  dataMin?: number;
  dataMax?: number;
  tickFormat: (value: any, index: number) => string;
}
