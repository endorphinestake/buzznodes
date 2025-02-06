// ** React Imports
import { memo, useState, useEffect, Fragment, SyntheticEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces & Enums Imports
import { EAlertType } from "@modules/alerts/enums";
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";
import DialogComponent from "@modules/shared/components/Dialog";
import ConfirmDialog from "@modules/shared/components/ConfirmDialog";

// ** Mui Imports
import {
  Tab,
  Typography,
  Box,
  Switch,
  FormHelperText,
  InputLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import { TabList, TabPanel, TabContext, LoadingButton } from "@mui/lab";
import { DeleteOutline } from "@mui/icons-material";
import { BellPlus, BellCheck, BellAlert } from "mdi-material-ui";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  blockchainValidator: TBlockchainValidator;
}

const ManageAlertsDialog = (props: IProps) => {
  // ** Props
  const { open, setOpen, blockchainValidator } = props;

  // ** State
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<EAlertType>(
    EAlertType.VOTING_POWER
  );

  const handleTabChange = (event: SyntheticEvent, newValue: EAlertType) => {
    setCurrentTab(newValue);
  };

  // ** Hooks
  const { t } = useTranslation();
  const {
    dispatch,
    alertSettings,
    userAlertSettings,

    isCreatingUserAlertSettingLoading,
    isCreatingUserAlertSettingLoaded,
    isCreatingUserAlertSettingError,

    isUpdatingOrDeletingUserAlertSettingLoading,
    isUpdatingOrDeletingUserAlertSettingLoaded,
    isUpdatingOrDeletingUserAlertSettingError,

    resetCreateUserAlertSettingState,
    resetUpdateOrDeleteUserAlertSettingState,
  } = useAlertService();

  const handleClose = () => setOpen(false);

  const handleConfirmDelete = () => {
    console.log("handleConfirmDelete...");
  };

  const handleClickDelete = () => setOpenDelete(true);

  return (
    <Fragment>
      <DialogComponent
        open={open}
        setOpen={setOpen}
        handleClose={handleClose}
        title={t("Manage Alerts for «{{moniker}}»", {
          moniker: blockchainValidator.moniker || "",
        })}
        maxWidth="md"
        content={
          <TabContext value={currentTab}>
            <TabList onChange={handleTabChange}>
              <Tab
                value={EAlertType.VOTING_POWER}
                label={t(`Voting Power`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.VOTING_POWER
                  ]?.[0] ? (
                    userAlertSettings[blockchainValidator.id][
                      EAlertType.VOTING_POWER
                    ][0].is_confirmed === false ? (
                      <BellAlert />
                    ) : (
                      <BellCheck />
                    )
                  ) : (
                    <BellPlus />
                  )
                }
              />
              <Tab
                value={EAlertType.UPTIME}
                label={t(`Uptime`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.UPTIME
                  ]?.[0] ? (
                    userAlertSettings[blockchainValidator.id][
                      EAlertType.UPTIME
                    ][0].is_confirmed === false ? (
                      <BellAlert />
                    ) : (
                      <BellCheck />
                    )
                  ) : (
                    <BellPlus />
                  )
                }
              />
              <Tab
                value={EAlertType.COMISSION}
                label={t(`Comission`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.COMISSION
                  ]?.[0] ? (
                    userAlertSettings[blockchainValidator.id][
                      EAlertType.COMISSION
                    ][0].is_confirmed === false ? (
                      <BellAlert />
                    ) : (
                      <BellCheck />
                    )
                  ) : (
                    <BellPlus />
                  )
                }
              />
              <Tab
                value={EAlertType.JAILED}
                label={t(`Jailed`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.JAILED
                  ]?.[0] ? (
                    userAlertSettings[blockchainValidator.id][
                      EAlertType.JAILED
                    ][0].is_confirmed === false ? (
                      <BellAlert />
                    ) : (
                      <BellCheck />
                    )
                  ) : (
                    <BellPlus />
                  )
                }
              />
              <Tab
                value={EAlertType.TOMBSTONED}
                label={t(`Tombstoned`)}
                icon={
                  userAlertSettings[blockchainValidator.id]?.[
                    EAlertType.TOMBSTONED
                  ]?.[0] ? (
                    userAlertSettings[blockchainValidator.id][
                      EAlertType.TOMBSTONED
                    ][0].is_confirmed === false ? (
                      <BellAlert />
                    ) : (
                      <BellCheck />
                    )
                  ) : (
                    <BellPlus />
                  )
                }
              />
            </TabList>
            <TabPanel
              value={EAlertType.VOTING_POWER}
              sx={{ textAlign: "left", mt: 4 }}
            >
              <Typography>
                Cake apple pie chupa chups biscuit liquorice tootsie roll
                liquorice sugar plum. Cotton candy wafer wafer jelly cake
                caramels brownie gummies.
              </Typography>
            </TabPanel>
            <TabPanel
              value={EAlertType.UPTIME}
              sx={{ textAlign: "left", mt: 4 }}
            >
              <Typography>
                Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie
                gummi bears jujubes candy canes. Chupa chups sesame snaps
                halvah.
              </Typography>
            </TabPanel>
            <TabPanel
              value={EAlertType.COMISSION}
              sx={{ textAlign: "left", mt: 4 }}
            >
              <Typography>
                Danish tiramisu jujubes cupcake chocolate bar cake cheesecake
                chupa chups. Macaroon ice cream tootsie roll carrot cake gummi
                bears.
              </Typography>
            </TabPanel>
            <TabPanel
              value={EAlertType.JAILED}
              sx={{ textAlign: "left", mt: 4 }}
            >
              <Typography>
                Danish tiramisu jujubes cupcake chocolate bar cake cheesecake
                chupa chups. Macaroon ice cream tootsie roll carrot cake gummi
                bears.
              </Typography>
            </TabPanel>
            <TabPanel
              value={EAlertType.TOMBSTONED}
              sx={{ textAlign: "left", mt: 4 }}
            >
              <Typography>
                Danish tiramisu jujubes cupcake chocolate bar cake cheesecake
                chupa chups. Macaroon ice cream tootsie roll carrot cake gummi
                bears.
              </Typography>
            </TabPanel>
          </TabContext>
        }
      />

      <ConfirmDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title={t(`Are you sure you want to delete alerts?`)}
        onConfirm={handleConfirmDelete}
      />
    </Fragment>
  );
};

export default memo(ManageAlertsDialog);
