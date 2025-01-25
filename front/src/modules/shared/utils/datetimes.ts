import { EValidatorChartPeriod } from "@modules/blockchains/enums";

export const formatChartTime = (
  timestamp: string,
  period: EValidatorChartPeriod
): string => {
  const date = new Date(Number(timestamp) * 1000);

  switch (period) {
    case EValidatorChartPeriod.H1:
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

    case EValidatorChartPeriod.H24:
      return date.toLocaleString("en-US", {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    case EValidatorChartPeriod.D7:
      return date.toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    case EValidatorChartPeriod.D30:
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    default:
      return date.toLocaleTimeString();
  }
};
