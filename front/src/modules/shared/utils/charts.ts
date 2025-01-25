import { formatChartTime } from "@modules/shared/utils/datetimes";
import { EValidatorChartPeriod } from "@modules/blockchains/enums";

export function transformValidatorData(
  data: {
    [validatorId: string]: [string, string][];
  },
  period: EValidatorChartPeriod
) {
  const timestamps = Array.from(
    new Set(
      Object.values(data)
        .flat()
        .map(([timestamp]) => timestamp)
    )
  );

  return timestamps.map((timestamp) => {
    const formattedData: { name: string; [key: string]: number | string } = {
      name: formatChartTime(timestamp, period),
    };

    Object.keys(data).forEach((validatorId) => {
      const validatorData = data[validatorId].find(
        ([time]) => time === timestamp
      );
      if (validatorData) {
        formattedData[validatorId] = Number(validatorData[1]);
      }
    });

    return formattedData;
  });
}
