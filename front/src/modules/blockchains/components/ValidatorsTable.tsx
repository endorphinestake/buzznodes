// ** React Imports
import { Fragment, useState } from "react";

// ** NextJS Imports
import Link from "next/link";
import { useRouter } from "next/router";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAuth } from "@hooks/useAuth";
import { useBlockchainService } from "@hooks/useBlockchainService";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces
import {
  IValidatorsTableProps,
  IValidatorsTableRow,
} from "@modules/blockchains/interfaces";
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** Shared Components
import ManageAlertsDialog from "@modules/alerts/components/ManageAlertsDialog";
import ValidatorMonikerLabel from "@modules/blockchains/components/labels/ValidatorMonikerLabel";

// ** MUI Imports
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BellPlus, BellCheck, ChartAreaspline } from "mdi-material-ui";

const ValidatorsTable = (props: IValidatorsTableProps) => {
  // ** Props
  const { validators, status, onAlertEdit } = props;

  // ** Hooks
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { isBlockchainValidatorsLoading } = useBlockchainService();
  const { userAlertSettings } = useAlertService();

  // ** State
  const [pageSize, setPageSize] = useState<number>(100);
  const [selectedValidator, setSelectedValidator] =
    useState<TBlockchainValidator>();
  const [isAlertSettingShow, setIsAlertSettingShow] = useState<boolean>(false);

  // ** Callbacks
  const handleClickBell = (row: TBlockchainValidator) => {
    if (user) {
      setSelectedValidator(row);
      setIsAlertSettingShow(true);
    } else {
      router.push("/login");
    }
  };

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
      field: "moniker",
      sortable: true,
      headerName: t(`Validator`),
      renderCell: ({ row }: IValidatorsTableRow) => {
        return <ValidatorMonikerLabel validator={row} />;
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
    {
      flex: 0.1,
      minWidth: 150,
      field: "uptime",
      sortable: true,
      headerName: t(`Uptime`),
      renderCell: ({ row }: IValidatorsTableRow) => {
        return `${row.uptime}%`;
      },
    },
    {
      flex: 0.05,
      minWidth: 55,
      field: "actions",
      sortable: false,
      headerName: "",
      renderCell: ({ row }: IValidatorsTableRow) => {
        return (
          <Fragment>
            <Link href={`/charts?validator_id=${row.id}`} passHref>
              <IconButton aria-label="capture screenshot" color="primary">
                <ChartAreaspline />
              </IconButton>
            </Link>

            <IconButton
              aria-label="capture screenshot"
              color="primary"
              disabled={row.tombstoned}
              onClick={() => {
                handleClickBell(row);
              }}
            >
              {userAlertSettings[row.id] ? (
                <Tooltip title={t(`Managing Alert Settings`)}>
                  <BellCheck color="success" />
                </Tooltip>
              ) : (
                <BellPlus />
              )}
            </IconButton>
          </Fragment>
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
        loading={isBlockchainValidatorsLoading}
        rows={validators}
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
      {selectedValidator ? (
        <ManageAlertsDialog
          open={isAlertSettingShow}
          setOpen={setIsAlertSettingShow}
          blockchainValidator={selectedValidator}
        />
      ) : null}
    </Fragment>
  );
};

export default ValidatorsTable;
