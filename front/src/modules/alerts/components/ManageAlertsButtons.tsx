// ** React Imports
import { Fragment, useState } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";
import { useAlertService } from "@hooks/useAlertService";

// ** Types & Interfaces
import { IManageUserAlertsButtonProps } from "@modules/alerts/interfaces";

// ** Shared Components Imports
import ConfirmDialog from "@modules/shared/components/ConfirmDialog";

// ** MUI Imports
import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { BellCheck, BellRemove } from "mdi-material-ui";

const ManageAlertsButtons = (props: IManageUserAlertsButtonProps) => {
  // ** Props
  const {
    handleSaveAlerts,
    handleClearAlerts,
    handleDeleteAlerts,
    isDisabledSave,
    isCanDelete,
  } = props;

  // ** Hooks
  const { t } = useTranslation();
  const { isCreatingUserAlertSettingLoading } = useAlertService();

  // ** State
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  // ** Handlers
  const handleClickDelete = () => setOpenDelete(true);

  return (
    <Fragment>
      <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <LoadingButton
            loading={isCreatingUserAlertSettingLoading}
            disabled={isDisabledSave}
            variant="contained"
            color="primary"
            onClick={handleSaveAlerts}
            endIcon={<BellCheck />}
          >
            {t(`Save`)}
          </LoadingButton>

          <LoadingButton
            variant="outlined"
            color="primary"
            onClick={handleClearAlerts}
          >
            {t(`Clear`)}
          </LoadingButton>
        </Grid>

        <Grid
          item
          xs={9}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {isCanDelete ? (
            <LoadingButton
              variant="contained"
              color="error"
              onClick={handleClickDelete}
              endIcon={<BellRemove />}
            >
              {t(`Delete`)}
            </LoadingButton>
          ) : null}
        </Grid>
      </Grid>

      <ConfirmDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title={t(`Are you sure you want to delete alerts?`)}
        onConfirm={handleDeleteAlerts}
      />
    </Fragment>
  );
};

export default ManageAlertsButtons;
