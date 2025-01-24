// ** Third Party Imports
import { TooltipProps } from "recharts";

// ** Types & Interfaces
import { IValidatorChartProps } from "@modules/blockchains/interfaces";

// ** MUI Imports
import { Box, Divider, Typography } from "@mui/material";

import { Circle } from "mdi-material-ui";

const tooltipStyles = {
  container: {
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    minWidth: "150px",
    fontSize: "14px",
    maxWidth: "300px",
    zIndex: 9999,
  },
  title: {
    fontWeight: "bold",
    marginBottom: "5px",
    fontSize: "16px",
    color: "#333",
  },
  divider: {
    margin: "5px 0",
  },
  item: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  text: {
    fontSize: "14px",
    color: "#555",
  },
};

export const ChartTooltip = (
  data: TooltipProps<any, any>,
  monikers: IValidatorChartProps["monikers"]
) => {
  const { active, payload } = data;

  if (active && payload) {
    return (
      <div className="recharts-custom-tooltip" style={tooltipStyles.container}>
        <Typography style={tooltipStyles.title}>{data.label}</Typography>
        <Divider sx={tooltipStyles.divider} />
        {data.payload &&
          data.payload.map((i: any) => {
            return (
              <Box sx={tooltipStyles.item} key={i.dataKey}>
                <Circle sx={{ color: i.fill, mr: 2.5, fontSize: "0.6rem" }} />
                <span style={tooltipStyles.text}>
                  {monikers[i.dataKey].moniker} : {i.payload[i.dataKey]}
                </span>
              </Box>
            );
          })}
      </div>
    );
  }

  return null;
};

export default ChartTooltip;
