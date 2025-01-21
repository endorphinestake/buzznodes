// ** React Imports
import { memo, useState, useEffect } from "react";
import { format } from "date-fns";

// ** NextJS Imports
import Head from "next/head";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";

// ** Types & Interfaces
import {
  IValidatorsTableProps,
  IValidatorsTableRow,
} from "@modules/blockchains/interfaces";

// ** Shared Components
import styles from "@styles/Home.module.css";

// ** MUI Imports
import { Box, Card, CardHeader, Grid, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

const ValidatorsTable = (props: IValidatorsTableProps) => {
  // ** Props
  const { validators, status, onAlertEdit } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { isBlockchainValidatorsLoading } = useBlockchainService();

  // ** State
  const [pageSize, setPageSize] = useState<number>(100);
  const [isAlertShow, setIsAlertShow] = useState<boolean>(false);

  // ** Vars
  const columns = [
    {
      flex: 0.1,
      minWidth: 170,
      field: "rank",
      sortable: true,
      headerName: t(`Rank`),
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "moniker",
      sortable: true,
      headerName: t(`Validator`),
      renderCell: ({ row }: IValidatorsTableRow) => {
        return row.moniker;
        // return Number(row.amount).toFixed(2).toString();
      },
    },
    // {
    //   flex: 0.1,
    //   minWidth: 150,
    //   field: "currency",
    //   sortable: true,
    //   headerName: t(`Currency`),
    //   renderCell: ({ row }: IValidatorsTableRow) => {
    //     return row.currency;
    //   },
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 150,
    //   field: "status",
    //   sortable: true,
    //   headerName: t(`Status`),
    //   renderCell: ({ row }: IValidatorsTableRow) => {
    //     return <RenderPayStatus payment={row} />;
    //   },
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 150,
    //   field: "created",
    //   sortable: true,
    //   headerName: t(`Created`),
    //   renderCell: ({ row }: IValidatorsTableRow) => {
    //     return (
    //       <Box>
    //         {format(new Date(row.created), "d MMM, yyyy")}
    //         <Box>
    //           <Typography variant="caption">
    //             {format(new Date(row.created), "H:mm:s")}
    //           </Typography>
    //         </Box>
    //       </Box>
    //     );
    //   },
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 150,
    //   field: "updated",
    //   sortable: true,
    //   headerName: t(`Updated`),
    //   renderCell: ({ row }: IValidatorsTableRow) => {
    //     return (
    //       <Box>
    //         {format(new Date(row.updated), "d MMM, yyyy")}
    //         <Box>
    //           <Typography variant="caption">
    //             {format(new Date(row.updated), "H:mm:s")}
    //           </Typography>
    //         </Box>
    //       </Box>
    //     );
    //   },
    // },
  ];

  return (
    <DataGrid
      sx={{ p: 3 }}
      autoHeight
      disableSelectionOnClick
      columns={columns}
      pageSize={pageSize}
      rowsPerPageOptions={[25, 50, 100, 500]}
      loading={isBlockchainValidatorsLoading}
      rows={validators}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      disableColumnMenu
      localeText={{
        noRowsLabel: t(`No rows`),
      }}
    />
  );
};

export default ValidatorsTable;
