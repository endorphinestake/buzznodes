export enum EAlertType {
  ANY = "",
  VOTING_POWER = "VOTING_POWER",
  UPTIME = "UPTIME",
  COMISSION = "COMISSION",
  JAILED = "JAILED",
  TOMBSTONED = "TOMBSTONED",
  BONDED = "BONDED",
  OTEL_UPDATE = "OTEL_UPDATE",
  SYNC_STATUS = "SYNC_STATUS",
}

export enum EAlertChannel {
  SMS = "SMS",
  VOICE = "VOICE",
}

export enum EAlertValueStatus {
  FALSE_TO_TRUE = "FALSE_TO_TRUE",
  TRUE_TO_FALSE = "TRUE_TO_FALSE",
}
