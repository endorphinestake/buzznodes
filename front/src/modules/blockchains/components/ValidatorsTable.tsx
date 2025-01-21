// ** React Imports
import { Fragment, useState, useEffect } from "react";
import { format } from "date-fns";

// ** NextJS Imports
import defaultValidatorIcon from "public/images/defaultValidatorIcon.webp";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useBlockchainService } from "@hooks/useBlockchainService";

// ** Types & Interfaces
import {
  IValidatorsTableProps,
  IValidatorsTableRow,
} from "@modules/blockchains/interfaces";

// ** Shared Components

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
      flex: 0.03,
      minWidth: 50,
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
        return (
          <Fragment>
            <img
              loading="lazy"
              width="25"
              src={
                row.picture && row.picture !== "default"
                  ? row.picture
                  : "/images/defaultValidatorIcon.webp"
              }
              alt="validator icon"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                fontWeight: 500,
                lineHeight: "22px",
                ml: 2,
              }}
            >
              {row.moniker ?? "-----"}
            </Typography>
          </Fragment>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "voting_power",
      sortable: true,
      headerName: t(`Voting Power`),
      renderCell: ({ row }: IValidatorsTableRow) => {
        return (
          <Box>
            {Intl.NumberFormat("ru-RU").format(row.voting_power)}
            <Box>
              <Typography variant="caption">
                {Number(row.voting_power_percentage).toFixed(2).toString()}%
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: "commision_rate",
      sortable: true,
      headerName: t(`Comission`),
      renderCell: ({ row }: IValidatorsTableRow) => {
        const commissionRate = row.commision_rate * 100;
        return `${commissionRate.toFixed(2)}%`;
      },
    },
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
      initialState={{
        sorting: {
          sortModel: [{ field: "rank", sort: "desc" }],
        },
      }}
    />
  );
};

export default ValidatorsTable;
