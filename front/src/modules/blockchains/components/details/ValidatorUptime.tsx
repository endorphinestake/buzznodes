// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

// ** Third Party Imports
import { ApexOptions } from "apexcharts";

// ** Custom Components Imports
import ReactApexcharts from "src/@core/components/react-apexcharts";

// ** Types & Interfaces Imports
import { TBlockchainValidatorDetail } from "@modules/blockchains/types";

// ** Utils Imports
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import { calculatePercentageChange } from "@modules/shared/utils/mathlib";

// ** MUI Imports
import { Card, CardContent, Typography, Box } from "@mui/material";

const ValidatorUptime = ({
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
  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true },
    },
    stroke: { lineCap: "round" },
    colors: [
      hexToRGBA(
        validator.uptime < 95
          ? theme.palette.error.main
          : validator.uptime < 99.9
          ? theme.palette.warning.main
          : theme.palette.success.main,
        1
      ),
    ],
    plotOptions: {
      radialBar: {
        hollow: { size: "55%" },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 5,
          },
        },
      },
    },
    grid: {
      padding: {
        bottom: -12,
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
  };

  return (
    <Card>
      <CardContent
        sx={{
          "& .apexcharts-canvas .apexcharts-text": {
            fontWeight: 600,
            fontSize: "1rem",
          },
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          <Typography variant="h6" sx={{ mr: 1.5 }}>
            {validator.uptime}%
          </Typography>
        </Box>
        <Typography variant="body2">{t(`Uptime`)}</Typography>
        <ReactApexcharts
          type="radialBar"
          height="75%"
          options={options}
          series={[validator.uptime]}
        />
      </CardContent>
    </Card>
  );
};

export default ValidatorUptime;
