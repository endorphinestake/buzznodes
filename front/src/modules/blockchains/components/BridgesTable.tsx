// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces
import {
  IBridgesTableProps,
  IBridgesTableRow,
} from "@modules/blockchains/interfaces";
import { TBlockchainBridge } from "@modules/blockchains/types";

// ** Utils Imports
import { formatShortText } from "@modules/shared/utils/text";
import { formatPingTime, getSyncStatus } from "@modules/shared/utils/text";
import { compareVersions } from "compare-versions";

// ** Shared Components
import ManageBridgeAlertsDialog from "@modules/alerts/components/ManageBridgeAlertsDialog";
import Notify from "@modules/shared/utils/Notify";

// ** MUI Imports
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BellPlus, BellCheck } from "mdi-material-ui";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const BridgesTable = (props: IBridgesTableProps) => {
  // ** Props
  const { bridges } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { isBlockchainBridgesLoading } = useBlockchainService();
  const { userAlertSettings } = useAlertService();

  // ** State
  const [pageSize, setPageSize] = useState<number>(100);
  const [selectedBridge, setSelectedBridge] = useState<TBlockchainBridge>();
  const [isAlertSettingShow, setIsAlertSettingShow] = useState<boolean>(false);

  // ** Vars
  const columns = [
    {
      flex: 0.05,
      minWidth: 50,
      field: "rank",
      sortable: true,
      headerName: t(`Rank`),
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "node_id",
      sortable: false,
      headerName: t(`Bridge ID`),
      renderCell: ({ row }: IBridgesTableRow) => {
        return (
          <Box>
            <Tooltip title={row.node_id}>
              <Box
                component="span"
                onClick={() => {
                  navigator.clipboard.writeText(row.node_id);
                  Notify("success", t(`Copied to clipboard`));
                }}
                sx={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {formatShortText(row.node_id)}
                <ContentCopyIcon
                  fontSize="inherit"
                  sx={{ marginLeft: "4px", verticalAlign: "middle" }}
                />
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "node_height",
      sortable: true,
      headerName: t(`Height`),
      renderCell: ({ row }: IBridgesTableRow) => {
        return (
          <Box>
            {Intl.NumberFormat("ru-RU").format(row.node_height)}
            <Box>
              <Typography variant="caption">
                {t(getSyncStatus(row.node_height_diff))}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "last_timestamp_diff",
      sortable: true,
      headerName: t(`Otel Update`),
      renderCell: ({ row }: IBridgesTableRow) => {
        return <Box>{t(formatPingTime(row.last_timestamp_diff))}</Box>;
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "version",
      sortable: true,
      headerName: t(`Version`),
      sortComparator: (v1: string, v2: string) => {
        return compareVersions(v1.replace(/^v/, ""), v2.replace(/^v/, ""));
      },
      renderCell: ({ row }: IBridgesTableRow) => {
        return (
          <Box>
            {row.version}
            <Box>
              <Typography variant="caption">{row.system_version}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.05,
      minWidth: 55,
      field: "actions",
      sortable: false,
      headerName: "",
      renderCell: ({ row }: IBridgesTableRow) => {
        return (
          <IconButton
            aria-label="capture screenshot"
            color="primary"
            onClick={() => {
              setSelectedBridge(row);
              setIsAlertSettingShow(true);
            }}
          >
            {userAlertSettings[row.id] ? (
              <Tooltip title={t(`Managing Alert Settings`)}>
                <BellCheck />
              </Tooltip>
            ) : (
              <BellPlus />
            )}
          </IconButton>
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
        rowsPerPageOptions={[25, 50, 100, 500]}
        loading={isBlockchainBridgesLoading}
        rows={bridges}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        disableColumnMenu
        localeText={{
          noRowsLabel: t(`No rows`),
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: "rank", sort: "asc" }],
          },
        }}
      />
      {selectedBridge ? (
        <ManageBridgeAlertsDialog
          open={isAlertSettingShow}
          setOpen={setIsAlertSettingShow}
          blockchainBridge={selectedBridge}
        />
      ) : null}
    </Fragment>
  );
};

export default BridgesTable;
