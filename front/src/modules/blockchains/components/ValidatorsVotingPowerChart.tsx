// ** React Imports
import { useState } from "react";

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

// ** Types & Interfaces Imports
import { IValidatorChartProps } from "@modules/blockchains/interfaces";

// ** MUI Imports
import { Box, Card, CardHeader, Typography, CardContent } from "@mui/material";
import { Circle } from "mdi-material-ui";

const ValidatorVotingPowerChart = (props: IValidatorChartProps) => {
  // ** Props
  const { data, monikers } = props;

  // ** Hooks
  const { t } = useTranslation();

  // ** Vars
  const transformedData = transformValidatorData(data);

  return (
    <Card>
      <CardHeader
        title={t(`Voting Power`)}
        titleTypographyProps={{ variant: "h6" }}
        sx={{
          flexDirection: ["column", "row"],
          alignItems: ["flex-start", "center"],
          "& .MuiCardHeader-action": { mb: 0 },
          "& .MuiCardHeader-content": { mb: [2, 0] },
        }}
      />
      <CardContent>
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
        <Box sx={{ height: 250, width: "100%", ml: 2, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transformedData} margin={{ left: -20 }}>
              <CartesianGrid />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={10}
                tick={{ fontSize: 10 }}
              />
              <YAxis scale="linear" type="number" />

              <Tooltip content={(props) => ChartTooltip(props, monikers)} />

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
      </CardContent>
    </Card>
  );
};

export default ValidatorVotingPowerChart;
