import { formatTimestamp } from "@modules/shared/utils/datetimes";

export function transformValidatorData(data: {
  [validatorId: string]: [string, string][];
}) {
  const timestamps = Array.from(
    new Set(
      Object.values(data)
        .flat()
        .map(([timestamp]) => timestamp)
    )
  );

  return timestamps.map((timestamp) => {
    const formattedData: { name: string; [key: string]: number | string } = {
      name: formatTimestamp(timestamp),
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
