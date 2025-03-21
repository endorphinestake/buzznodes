// ** React Imports
import { Fragment, useState } from "react";
import { format } from "date-fns";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces
import {
  IAlertHistoryTableProps,
  IAlertsHistoryTableRow,
} from "@modules/alerts/interfaces";
import { EAlertChannel, EAlertType } from "@modules/alerts/enums";
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** Shared Components
import BridgeMonikerLabel from "@modules/blockchains/components/labels/BridgeMonikerLabel";
import ValidatorMonikerLabel from "@modules/blockchains/components/labels/ValidatorMonikerLabel";

// ** MUI Imports
import { Box, Typography, Tooltip } from "@mui/material";
import { DataGrid, GridAlignment } from "@mui/x-data-grid";
import { Phone, Cellphone } from "mdi-material-ui";

const RenderAlertIcon = (message_type: string) => {
  if (message_type.startsWith("SMS")) {
    return <Cellphone fontSize="small" color="primary" sx={{ m: 0.5 }} />;
  } else if (message_type.startsWith("Voice")) {
    return <Phone fontSize="small" color="primary" sx={{ m: 0.5 }} />;
  }
};

const AlertsHistoryTable = (props: IAlertHistoryTableProps) => {
  // ** Props
  const { histories } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { isAlertHistoryLoading } = useAlertService();

  // ** State
  const [pageSize, setPageSize] = useState<number>(100);

  // ** Vars
  const columns = [
    {
      flex: 0.1,
      minWidth: 220,
      field: "moniker",
      sortable: false,
      headerName: t(`Moniker`),
      headerAlign: "center" as GridAlignment,
      renderCell: ({ row }: IAlertsHistoryTableRow) => {
        if (row.bridge) {
          return <BridgeMonikerLabel bridge={row.bridge} />;
        } else {
          return (
            <ValidatorMonikerLabel
              validator={row.validator as TBlockchainValidator}
            />
          );
        }
      },
    },
    {
      flex: 0.1,
      minWidth: 95,
      field: EAlertType.VOTING_POWER,
      sortable: false,
      headerName: t(`V-Power`),
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      renderCell: ({ row }: IAlertsHistoryTableRow) => {
        if (row.message_type.includes("VotingPower")) {
          return (
            <Tooltip title={row.message ?? ""}>
              <span>{RenderAlertIcon(row.message_type)}</span>
            </Tooltip>
          );
        }
        return "-";
      },
    },
    {
      flex: 0.1,
      minWidth: 90,
      field: EAlertType.UPTIME,
      sortable: false,
      headerName: t(`Uptime`),
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      renderCell: ({ row }: IAlertsHistoryTableRow) => {
        if (row.message_type.includes("Uptime")) {
          return (
            <Tooltip title={row.message ?? ""}>
              <span>{RenderAlertIcon(row.message_type)}</span>
            </Tooltip>
          );
        }
        return "-";
      },
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: EAlertType.COMISSION,
      sortable: false,
      headerName: t(`Comission`),
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      renderCell: ({ row }: IAlertsHistoryTableRow) => {
        if (row.message_type.includes("Comission")) {
          return (
            <Tooltip title={row.message ?? ""}>
              <span>{RenderAlertIcon(row.message_type)}</span>
            </Tooltip>
          );
        }
        return "-";
      },
    },
    {
      flex: 0.1,
      minWidth: 90,
      field: EAlertType.JAILED,
      sortable: false,
      headerName: t(`Jailed`),
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      renderCell: ({ row }: IAlertsHistoryTableRow) => {
        if (row.message_type.includes("Jailed")) {
          return (
            <Tooltip title={row.message ?? ""}>
              <span>{RenderAlertIcon(row.message_type)}</span>
            </Tooltip>
          );
        }
        return "-";
      },
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: EAlertType.BONDED,
      sortable: false,
      headerName: t(`Bond`),
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      renderCell: ({ row }: IAlertsHistoryTableRow) => {
        if (row.message_type.includes("Bond")) {
          return (
            <Tooltip title={row.message ?? ""}>
              <span>{RenderAlertIcon(row.message_type)}</span>
            </Tooltip>
          );
        }
        return "-";
      },
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: EAlertType.OTEL_UPDATE,
      sortable: false,
      headerName: t(`Otel Update`),
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      cellClassName: "bridge-cell",
      renderCell: ({ row }: IAlertsHistoryTableRow) => {
        if (row.message_type.includes("OtelUpdate")) {
          return (
            <Tooltip title={row.message ?? ""}>
              <span>{RenderAlertIcon(row.message_type)}</span>
            </Tooltip>
          );
        }
        return "-";
      },
    },
    {
      flex: 0.1,
      minWidth: 125,
      field: EAlertType.SYNC_STATUS,
      sortable: false,
      headerName: t(`Sync Status`),
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      cellClassName: "bridge-cell",
      renderCell: ({ row }: IAlertsHistoryTableRow) => {
        if (row.message_type.includes("SyncStatus")) {
          return (
            <Tooltip title={row.message ?? ""}>
              <span>{RenderAlertIcon(row.message_type)}</span>
            </Tooltip>
          );
        }
        return "-";
      },
    },

    {
      flex: 0.1,
      minWidth: 130,
      field: "created",
      sortable: true,
      headerName: t(`Created`),
      renderCell: ({ row }: IAlertsHistoryTableRow) => {
        return (
          <Box>
            {format(new Date(row.created), "d MMM, yyyy")}
            <Box>
              <Typography variant="caption">
                {format(new Date(row.created), "HH:mm:ss")}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
  ];

  return (
    <Fragment>
      <DataGrid
        sx={{ p: 3 }}
        autoHeight
        disableSelectionOnClick
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[25, 50, 100]}
        loading={isAlertHistoryLoading}
        rows={histories}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        disableColumnMenu
        getRowId={(row) => Math.floor(Math.random() * 1000000)}
      />
    </Fragment>
  );
};

export default AlertsHistoryTable;
