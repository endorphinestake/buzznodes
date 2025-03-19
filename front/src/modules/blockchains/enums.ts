export enum EBlockchainType {
  COSMOS = "COSMOS",
}

export enum EBlockchainValidatorType {
  ANY = "",
  VALIDATOR = "VALIDATOR",
  BRIDGE = "BRIDGE",
}

export enum EBlockchainValidatorStatus {
  ANY = "",
  BOND_STATUS_UNSPECIFIED = "BOND_STATUS_UNSPECIFIED",
  BOND_STATUS_BONDED = "BOND_STATUS_BONDED",
  BOND_STATUS_UNBONDED = "BOND_STATUS_UNBONDED",
  BOND_STATUS_UNBONDING = "BOND_STATUS_UNBONDING",
}

export enum EValidatorChartType {
  COSMOS_UPTIME = "cosmos_validator_uptime",
  COSMOS_VOTING_POWER = "cosmos_validator_voting_power",
  COSMOS_COMISSION = "cosmos_validator_commission_rate",
}

export enum EValidatorChartPeriod {
  H1 = "h1",
  H24 = "24h",
  D7 = "7d",
  D30 = "30d",
}

export enum EValidatorChartStep {
  S25 = "25s",
  M10 = "10m",
  H1 = "1h",
  H4 = "4h",
}
