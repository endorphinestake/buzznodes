// ** React Imports
import { useState, useEffect } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

// ** Third Party Imports
import { ApexOptions } from "apexcharts";

// ** Custom Components Imports
import ReactApexcharts from "src/@core/components/react-apexcharts";

// ** Types & Interfaces Imports
import {
  TBlockchainValidatorDetail,
  TValidatorChart,
} from "@modules/blockchains/types";
import {
  EValidatorChartType,
  EValidatorChartPeriod,
} from "@modules/blockchains/enums";

// ** Utils Imports
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";

// ** MUI Imports
import { Card, CardContent, Typography, Box } from "@mui/material";

const ValidatorVotingPower = ({
  validator,
  charts,
}: {
  validator: TBlockchainValidatorDetail;
  charts: Array<{ name: string; [key: string]: number | string }>;
}) => {
  // ** Hooks
  const { t } = useTranslation();
  const theme = useTheme();

  // ** Vars
  const categories = charts.map((item) => item.name);
  const series = [
    {
      name: "",
      data: charts.map((item) => Number(item[validator.id]) || null),
    },
  ];

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    grid: {
      padding: {
        top: -15,
        left: -14,
        right: -4,
        bottom: -15,
      },
      yaxis: {
        lines: { show: false },
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [hexToRGBA(theme.palette.primary.main, 1)],
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: "48%",
      },
    },
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: categories,
    },
    yaxis: {
      labels: { show: false },
    },
    tooltip: {
      y: {
        formatter: (value: number) => Intl.NumberFormat("ru-RU").format(value),
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          <Typography variant="h6" sx={{ mr: 1.5 }}>
            $42.5k
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "error.main" }}>
            -22%
          </Typography>
        </Box>
        <Typography variant="body2">{t(`Voting Power`)}</Typography>
        <ReactApexcharts
          type="bar"
          height="95%"
          options={options}
          series={series}
        />
      </CardContent>
    </Card>
  );
};

export default ValidatorVotingPower;
