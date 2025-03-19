// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

// ** Utils Imports
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";

// ** Types & Interfaces Imports
import { TBlockchainValidatorDetail } from "@modules/blockchains/types";

// ** Third Party Imports
import { ApexOptions } from "apexcharts";

// ** Shared Components Imports
import ReactApexcharts from "src/@core/components/react-apexcharts";

// ** MUI Imports
import { Card, CardHeader, CardContent, IconButton } from "@mui/material";
import { DotsVertical } from "mdi-material-ui";

const ValidatorComission = ({
  validator,
}: {
  validator: TBlockchainValidatorDetail;
}) => {
  // ** Hooks
  const { t } = useTranslation();
  const theme = useTheme();

  // ** Vars
  const series = [
    {
      name: "",
      data: [
        validator.commision_rate * 100,
        validator.commision_max_rate * 100,
        validator.commision_max_change_rate * 100,
      ],
    },
  ];
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        barHeight: "40%",
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
    },
    grid: {
      strokeDashArray: 4,
      xaxis: {
        lines: { show: true },
      },
      yaxis: {
        lines: { show: false },
      },
      padding: {
        top: -20,
        left: 15,
        right: 25,
        bottom: 10,
      },
    },
    colors: [hexToRGBA(theme.palette.primary.main, 0.8)],
    legend: { show: false },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: [t("Comission"), t("Max Rate"), t("Max Change Rate")],
      labels: {
        formatter: (val) => `${val}%`,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "13px",
          fontWeight: 600,
          colors: "text.primary",
        },
        align: theme.direction === "rtl" ? "right" : "left",
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
  };

  return (
    <Card>
      <CardHeader
        title={`${validator.commision_rate * 100}%`}
        subheader={t("Comission")}
        subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
        titleTypographyProps={{ sx: { letterSpacing: "0.15px" } }}
        action={
          <IconButton
            size="small"
            aria-label="settings"
            className="card-more-options"
          >
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent
        sx={{
          p: "0 !important",
          "& .apexcharts-canvas .apexcharts-yaxis-label": {
            fontSize: "0.875rem",
            fontWeight: 600,
          },
          "& .apexcharts-canvas .apexcharts-xaxis-label": {
            fontSize: "0.875rem",
            fill: theme.palette.text.disabled,
          },
          "& .apexcharts-data-labels .apexcharts-datalabel": {
            fontWeight: 500,
            fontSize: "0.875rem",
            fill: theme.palette.common.white,
          },
        }}
      >
        <ReactApexcharts
          type="bar"
          height="150%"
          series={series}
          options={options}
        />
      </CardContent>
    </Card>
  );
};

export default ValidatorComission;
