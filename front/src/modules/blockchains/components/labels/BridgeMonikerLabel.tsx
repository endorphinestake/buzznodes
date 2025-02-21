// ** Types & Interfaces Imports
import { TBlockchainBridge } from "@modules/blockchains/types";
import { TUserAlertSettingsResponse } from "@modules/alerts/types";
import { EAlertType } from "@modules/alerts/enums";

// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";

// ** Utils Imports
import { formatShortText } from "@modules/shared/utils/text";

// ** MUI Imports
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const BridgeMonikerLabel = ({
  bridge,
  userAlertSettings,
}: {
  bridge: TBlockchainBridge;
  userAlertSettings?: TUserAlertSettingsResponse;
}) => {
  // ** Hooks
  const { t } = useTranslation();

  return (
    <Box>
      <Tooltip title={bridge?.node_id}>
        <Box
          component="span"
          onClick={() => {
            navigator.clipboard.writeText(bridge?.node_id);
            Notify("success", t(`Copied to clipboard`));
          }}
          sx={{
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {formatShortText(bridge?.node_id || "")}
          <ContentCopyIcon
            fontSize="inherit"
            sx={{ marginLeft: "4px", verticalAlign: "middle" }}
          />
        </Box>
      </Tooltip>

      <Box>
        {userAlertSettings ? (
          <Typography variant="caption">
            {userAlertSettings[EAlertType.OTEL_UPDATE]?.[0]?.moniker ||
              userAlertSettings[EAlertType.SYNC_STATUS]?.[0]?.moniker}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default BridgeMonikerLabel;
