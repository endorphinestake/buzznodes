// ** React Imports
import { Fragment, useState, useEffect } from "react";
import { format } from "date-fns";

// ** NextJS Imports
import Link from "next/link";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces
import {
  IValidatorsTableProps,
  IBridgesTableProps,
  IValidatorsTableRow,
  IBridgesTableRow,
} from "@modules/blockchains/interfaces";
import {
  TBlockchainValidator,
  TBlockchainBridge,
} from "@modules/blockchains/types";
import { EAlertType } from "@modules/alerts/enums";

// ** Shared Components
import ManageAlertsDialog from "@modules/alerts/components/ManageAlertsDialog";

// ** MUI Imports
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  BellPlus,
  BellCheck,
  BellAlert,
  ChartAreaspline,
} from "mdi-material-ui";

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
      sortable: true,
      headerName: t(`Node ID`),
      renderCell: ({ row }: IBridgesTableRow) => {
        return (
          <Fragment>
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                fontWeight: 500,
                lineHeight: "22px",
                ml: 2,
              }}
            >
              {row.node_id}
            </Typography>
          </Fragment>
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
            // disabled={row.tombstoned}
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
      {/* {selectedBridge ? (
        <ManageAlertsDialog
          open={isAlertSettingShow}
          setOpen={setIsAlertSettingShow}
          blockchainValidator={selectedValidator}
        />
      ) : null} */}
    </Fragment>
  );
};

export default BridgesTable;
