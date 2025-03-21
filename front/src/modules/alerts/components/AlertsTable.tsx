// ** React Imports
import { Fragment, useState } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useDomain } from "@context/DomainContext";
import { useAlertService } from "@hooks/useAlertService";

// ** Utils Imports
import { getRowsFromAlerts } from "@modules/alerts/utils";
import { getSettingByUserSettings } from "@modules/alerts/utils";
import { formatPingTime } from "@modules/shared/utils/text";

// ** Types & Interfaces
import { IAlertsTableProps, IAlertsTableRow } from "@modules/alerts/interfaces";
import {
  EAlertChannel,
  EAlertType,
  EAlertValueStatus,
} from "@modules/alerts/enums";
import {
  TBlockchainValidator,
  TBlockchainBridge,
} from "@modules/blockchains/types";
import { TUserAlertSettingBase } from "@modules/alerts/types";

// ** Shared Components
import ManageAlertsDialog from "@modules/alerts/components/ManageAlertsDialog";
import ManageBridgeAlertsDialog from "@modules/alerts/components/ManageBridgeAlertsDialog";
import BridgeMonikerLabel from "@modules/blockchains/components/labels/BridgeMonikerLabel";
import ValidatorMonikerLabel from "@modules/blockchains/components/labels/ValidatorMonikerLabel";

// ** MUI Imports
import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridAlignment } from "@mui/x-data-grid";
import { BellCog, Phone, Cellphone } from "mdi-material-ui";

const RenderAlertIcon = (channel: EAlertChannel) => {
  return channel === EAlertChannel.SMS ? (
    <Cellphone fontSize="small" color="primary" sx={{ m: 0.5 }} />
  ) : (
    <Phone fontSize="small" color="primary" sx={{ m: 0.5 }} />
  );
};

const AlertsTable = (props: IAlertsTableProps) => {
  // ** Props
  const { alertSettings, userAlertSettings, validators, bridges } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { symbol } = useDomain();
  const { isAlertSettingsLoading, isUserAlertSettingsLoading } =
    useAlertService();

  // ** State
  const [pageSize, setPageSize] = useState<number>(100);
  const [selectedValidator, setSelectedValidator] =
    useState<TBlockchainValidator | null>(null);
  const [selectedBridge, setSelectedBridge] =
    useState<TBlockchainBridge | null>(null);
  const [isAlertSettingShow, setIsAlertSettingShow] = useState<boolean>(false);
  const [isBridgeAlertSettingShow, setIsBridgeAlertSettingShow] =
    useState<boolean>(false);

  // ** Vars
  const columns = [
    {
      flex: 0.1,
      minWidth: 220,
      field: "moniker",
      sortable: false,
      headerName: t(`Moniker`),
      headerAlign: "center" as GridAlignment,
      renderCell: ({ row }: IAlertsTableRow) => {
        if (
          row[EAlertType.OTEL_UPDATE].length ||
          row[EAlertType.SYNC_STATUS].length
        ) {
          const bridge = bridges.find((item) => item.id === +row.id);
          return bridge ? (
            <BridgeMonikerLabel bridge={bridge} userAlertSettings={row} />
          ) : (
            "-"
          );
        } else {
          const validator = validators.find((item) => item.id === +row.id);
          return validator ? (
            <ValidatorMonikerLabel validator={validator} />
          ) : (
            "-"
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
      renderCell: ({ row }: IAlertsTableRow) => {
        if (
          !row[EAlertType.VOTING_POWER].length ||
          !alertSettings[EAlertType.VOTING_POWER]
        ) {
          return "—";
        }

        return (
          <>
            {row[EAlertType.VOTING_POWER].map(
              (item: TUserAlertSettingBase, index: number) => {
                const setting = getSettingByUserSettings(
                  alertSettings[EAlertType.VOTING_POWER],
                  [item]
                );
                return setting ? (
                  <Tooltip
                    key={index}
                    title={`${item.channels} Alert - when the Voting Power ${
                      setting.value > 0 ? "Increases" : "Decreases"
                    } ${Intl.NumberFormat("ru-RU").format(
                      Math.abs(setting.value)
                    )} ${symbol}`}
                  >
                    {RenderAlertIcon(item.channels)}
                  </Tooltip>
                ) : null;
              }
            )}
          </>
        );
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
      renderCell: ({ row }: IAlertsTableRow) => {
        if (
          !row[EAlertType.UPTIME].length ||
          !alertSettings[EAlertType.UPTIME]
        ) {
          return "—";
        }

        return (
          <>
            {row[EAlertType.UPTIME].map(
              (item: TUserAlertSettingBase, index: number) => {
                const setting = getSettingByUserSettings(
                  alertSettings[EAlertType.UPTIME],
                  [item]
                );
                return setting ? (
                  <Tooltip
                    key={index}
                    title={`${item.channels} Alert - when the Uptime ${
                      setting.value > 0 ? "Increases" : "Decreases"
                    } to ${(100 - Math.abs(setting.value)).toFixed(2)}%`}
                  >
                    {RenderAlertIcon(item.channels)}
                  </Tooltip>
                ) : null;
              }
            )}
          </>
        );
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
      renderCell: ({ row }: IAlertsTableRow) => {
        if (
          !row[EAlertType.COMISSION].length ||
          !alertSettings[EAlertType.COMISSION]
        ) {
          return "—";
        }

        return (
          <>
            {row[EAlertType.COMISSION].map(
              (item: TUserAlertSettingBase, index: number) => {
                const setting = getSettingByUserSettings(
                  alertSettings[EAlertType.COMISSION],
                  [item]
                );
                return setting ? (
                  <Tooltip
                    key={index}
                    title={`${item.channels} Alert - when the Comission ${
                      setting.value > 0 ? "Increases" : "Decreases"
                    } to ${Math.abs(setting.value * 100)}%`}
                  >
                    {RenderAlertIcon(item.channels)}
                  </Tooltip>
                ) : null;
              }
            )}
          </>
        );
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
      renderCell: ({ row }: IAlertsTableRow) => {
        if (
          !row[EAlertType.JAILED].length ||
          !alertSettings[EAlertType.JAILED]
        ) {
          return "—";
        }

        return (
          <>
            {row[EAlertType.JAILED].map(
              (item: TUserAlertSettingBase, index: number) => {
                const setting = getSettingByUserSettings(
                  alertSettings[EAlertType.JAILED],
                  [item]
                );
                return setting ? (
                  <Tooltip
                    key={index}
                    title={`${
                      item.channels
                    } Alert - when the Jailed status changed ${
                      setting.value === EAlertValueStatus.FALSE_TO_TRUE
                        ? `from "False" to "True"`
                        : `from "True" to "False"`
                    }`}
                  >
                    {RenderAlertIcon(item.channels)}
                  </Tooltip>
                ) : null;
              }
            )}
          </>
        );
      },
    },
    // {
    //   flex: 0.1,
    //   minWidth: 120,
    //   field: EAlertType.TOMBSTONED,
    //   sortable: false,
    //   headerName: t(`Tombstoned`),
    //   align: "center" as GridAlignment,
    //   headerAlign: "center" as GridAlignment,
    //   renderCell: ({ row }: IAlertsTableRow) => {
    //     if (
    //       !row[EAlertType.TOMBSTONED].length ||
    //       !alertSettings[EAlertType.TOMBSTONED]
    //     ) {
    //       return "—";
    //     }

    //     return (
    //       <>
    //         {row[EAlertType.TOMBSTONED].map(
    //           (item: TUserAlertSettingBase, index: number) => {
    //             const setting = getSettingByUserSettings(
    //               alertSettings[EAlertType.TOMBSTONED],
    //               [item]
    //             );
    //             return setting ? (
    //               <Tooltip
    //                 key={index}
    //                 title={`${item.channels} Alert - on tombstoned status change from "False" to "True"`}
    //               >
    //                 {RenderAlertIcon(item.channels)}
    //               </Tooltip>
    //             ) : null;
    //           }
    //         )}
    //       </>
    //     );
    //   },
    // },
    {
      flex: 0.1,
      minWidth: 80,
      field: EAlertType.BONDED,
      sortable: false,
      headerName: t(`Bond`),
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      renderCell: ({ row }: IAlertsTableRow) => {
        if (
          !row[EAlertType.BONDED].length ||
          !alertSettings[EAlertType.BONDED]
        ) {
          return "—";
        }

        return (
          <>
            {row[EAlertType.BONDED].map(
              (item: TUserAlertSettingBase, index: number) => {
                const setting = getSettingByUserSettings(
                  alertSettings[EAlertType.BONDED],
                  [item]
                );
                return setting ? (
                  <Tooltip
                    key={index}
                    title={`${
                      item.channels
                    } Alert - when the Bond status changed ${
                      setting.value === EAlertValueStatus.FALSE_TO_TRUE
                        ? `from "False" to "True"`
                        : `from "True" to "False"`
                    }`}
                  >
                    {RenderAlertIcon(item.channels)}
                  </Tooltip>
                ) : null;
              }
            )}
          </>
        );
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
      renderCell: ({ row }: IAlertsTableRow) => {
        if (
          !row[EAlertType.OTEL_UPDATE].length ||
          !alertSettings[EAlertType.OTEL_UPDATE]
        ) {
          return "—";
        }

        return (
          <>
            {row[EAlertType.OTEL_UPDATE].map(
              (item: TUserAlertSettingBase, index: number) => {
                const setting = getSettingByUserSettings(
                  alertSettings[EAlertType.OTEL_UPDATE],
                  [item]
                );
                return setting ? (
                  <Tooltip
                    key={index}
                    title={`${item.channels} Alert - ${formatPingTime(
                      setting.value
                    )}`}
                  >
                    {RenderAlertIcon(item.channels)}
                  </Tooltip>
                ) : null;
              }
            )}
          </>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: EAlertType.SYNC_STATUS,
      sortable: false,
      headerName: t(`Sync Status`),
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      cellClassName: "bridge-cell",
      renderCell: ({ row }: IAlertsTableRow) => {
        if (
          !row[EAlertType.SYNC_STATUS].length ||
          !alertSettings[EAlertType.SYNC_STATUS]
        ) {
          return "—";
        }

        return (
          <>
            {row[EAlertType.SYNC_STATUS].map(
              (item: TUserAlertSettingBase, index: number) => {
                const setting = getSettingByUserSettings(
                  alertSettings[EAlertType.SYNC_STATUS],
                  [item]
                );
                return setting ? (
                  <Tooltip
                    key={index}
                    title={`${item.channels} Alert - behind ${Intl.NumberFormat(
                      "ru-RU"
                    ).format(Math.abs(setting.value))} blocks`}
                  >
                    {RenderAlertIcon(item.channels)}
                  </Tooltip>
                ) : null;
              }
            )}
          </>
        );
      },
    },
    {
      flex: 0.09,
      minWidth: 55,
      field: "actions",
      sortable: false,
      headerName: "",
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      renderCell: ({ row }: IAlertsTableRow) => {
        return (
          <IconButton
            aria-label="capture screenshot"
            color="primary"
            onClick={() => {
              if (
                row[EAlertType.OTEL_UPDATE].length ||
                row[EAlertType.SYNC_STATUS].length
              ) {
                const bridge = bridges.find((item) => item.id === +row.id);
                if (bridge) {
                  setSelectedValidator(null);
                  setSelectedBridge(bridge);
                  setIsBridgeAlertSettingShow(true);
                }
              } else {
                const validator = validators.find(
                  (item) => item.id === +row.id
                );
                if (validator) {
                  setSelectedBridge(null);
                  setSelectedValidator(validator);
                  setIsAlertSettingShow(true);
                }
              }
            }}
          >
            <Tooltip title={t(`Managing Alert Settings`)}>
              <BellCog color="success" />
            </Tooltip>
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
        rowsPerPageOptions={[25, 50, 100]}
        loading={isAlertSettingsLoading || isUserAlertSettingsLoading}
        rows={getRowsFromAlerts(userAlertSettings)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        disableColumnMenu
        getRowId={(row) => Math.floor(Math.random() * 1000000)}
        localeText={{
          noRowsLabel: t(
            `No enabled alerts. Enable them on the Validators or Bridges page`
          ),
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: "id", sort: "asc" }],
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

      {selectedBridge ? (
        <ManageBridgeAlertsDialog
          open={isBridgeAlertSettingShow}
          setOpen={setIsBridgeAlertSettingShow}
          blockchainBridge={selectedBridge}
        />
      ) : null}
    </Fragment>
  );
};

export default AlertsTable;
