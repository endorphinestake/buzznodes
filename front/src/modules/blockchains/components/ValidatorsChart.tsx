// ** React Imports
import { memo, useState } from "react";

// ** Third Party Imports
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Utils imports
import { transformValidatorData } from "@modules/shared/utils/charts";

// ** Components Imports
import ChartTooltip from "@modules/blockchains/components/ChartsTooltip";
import CollapsedCard from "@modules/shared/components/CollapsedCard";

// ** Types & Interfaces Imports
import { IValidatorChartProps } from "@modules/blockchains/interfaces";

// ** MUI Imports
import { Box, Card, CardHeader, Typography, CardContent } from "@mui/material";
import { Circle } from "mdi-material-ui";

const ValidatorsChart = (props: IValidatorChartProps) => {
  // ** Props
  let { chartTitle, data, monikers, dataMin, dataMax, tickFormat } = props;

  // ** Hooks
  const { t } = useTranslation();

  // ** Vars
  const transformedData = transformValidatorData(data);
  const allValues = transformedData.flatMap((d) =>
    Object.values(d).filter((value) => typeof value === "number")
  );

  // Autoscale min/max Y
  if (!dataMin && !dataMax) {
    dataMin = Math.min(...allValues.map((value) => Number(value)));
    dataMax = Math.max(...allValues.map((value) => Number(value)));

    if (dataMin === dataMax) {
      const fixedPadding = 5;
      dataMin -= fixedPadding;
      dataMax += fixedPadding;
    } else {
      const padding = Math.round((dataMax - dataMin) * 0.1);
      dataMin -= padding;
      dataMax += padding;
    }
  }

  // console.log("dataMin: ", dataMin);
  // console.log("dataMax: ", dataMax);

  return (
    <CollapsedCard title={chartTitle}>
      <Box sx={{ display: "flex", mb: 4 }}>
        {Object.keys(data).map((validatorId) => (
          <Box
            key={validatorId}
            sx={{ mr: 6, display: "flex", alignItems: "center" }}
          >
            <Circle
              sx={{
                mr: 1.5,
                fontSize: "0.75rem",
                color: monikers[validatorId].color,
              }}
            />
            <Typography>{monikers[validatorId].moniker}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ height: 300, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transformedData}>
            <CartesianGrid stroke="rgba(169, 169, 169, 0.1)" />
            <XAxis dataKey="name" tickCount={15} tick={{ fontSize: 10 }} />
            <YAxis
              type="number"
              tick={{ fontSize: 10 }}
              domain={[dataMin ?? 0, dataMax ?? 100]}
              tickCount={15}
              allowDataOverflow={true}
              tickFormatter={tickFormat}
            />

            <Tooltip
              content={(props) => ChartTooltip(props, monikers, tickFormat)}
            />
            {Object.keys(transformedData[0])
              .filter((key) => key !== "name")
              .map((validatorId) => (
                <Area
                  key={validatorId}
                  dataKey={validatorId}
                  stackId={validatorId}
                  stroke="0"
                  fill={monikers[validatorId].color}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </CollapsedCard>
  );
};

export default ValidatorsChart;
