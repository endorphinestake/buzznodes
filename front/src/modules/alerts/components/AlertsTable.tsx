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
import { IAlertsTableProps, IAlertsTableRow } from "@modules/alerts/interfaces";
import { TBlockchainValidator } from "@modules/blockchains/types";
import { EAlertType } from "@modules/alerts/enums";
import { TAlertSettingsResponse } from "@modules/alerts/types";

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

const AlertsTable = (props: IAlertsTableProps) => {
  // ** Props
  const { alerts } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { isUserAlertSettingsLoading } = useAlertService();

  // ** State
  const [pageSize, setPageSize] = useState<number>(100);
  const [selectedAlert, setSelectedAlert] = useState<TAlertSettingsResponse>();
  const [isAlertSettingShow, setIsAlertSettingShow] = useState<boolean>(false);

  // ** Vars
  const columns = [
    {
      flex: 0.1,
      minWidth: 150,
      field: "moniker",
      sortable: true,
      headerName: t(`Moniker`),
      renderCell: ({ row }: IAlertsTableRow) => {
        return 111;
      },
    },
    {
      flex: 0.05,
      minWidth: 55,
      field: "actions",
      sortable: false,
      headerName: "",
      renderCell: ({ row }: IAlertsTableRow) => {
        return 222;
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
        loading={isUserAlertSettingsLoading}
        rows={[]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        disableColumnMenu
        localeText={{
          noRowsLabel: t(`No rows`),
        }}
        // initialState={{
        //   sorting: {
        //     sortModel: [{ field: "rank", sort: "asc" }],
        //   },
        // }}
      />
      {/* {selectedAlert ? (
        <ManageAlertsDialog
          open={isAlertSettingShow}
          setOpen={setIsAlertSettingShow}
          blockchainValidator={selectedValidator}
        />
      ) : null} */}
    </Fragment>
  );
};

export default AlertsTable;
