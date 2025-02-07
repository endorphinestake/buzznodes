// ** React Imports
import { MouseEvent } from "react";

// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Types && Interfaces Imports
import { EAlertChannel } from "@modules/alerts/enums";

// ** MUI Imports
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Phone, Cellphone } from "mdi-material-ui";

interface IProps {
  channel: EAlertChannel;
  setChannel: (value: EAlertChannel) => void;
  channels: EAlertChannel[];
}

const ManageAlertsChannels = (props: IProps) => {
  // ** Props
  const { channel, setChannel, channels } = props;

  // ** Hooks
  const { t } = useTranslation();

  // ** Handlers
  const handleSelect = (
    event: MouseEvent<HTMLElement>,
    newChannel: EAlertChannel
  ) => {
    setChannel(newChannel);
  };

  if (!channels || !channels.length) return <></>;

  if (!channels.includes(channel)) {
    setChannel(channels[0]);
  }

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={channel}
        size="small"
        onChange={handleSelect}
      >
        {channels.includes(EAlertChannel.SMS) && (
          <ToggleButton value={EAlertChannel.SMS}>
            <Cellphone /> {t(`SMS`)}
          </ToggleButton>
        )}

        {channels.includes(EAlertChannel.VOICE) && (
          <ToggleButton value={EAlertChannel.VOICE}>
            <Phone /> {t(`Voice`)}
          </ToggleButton>
        )}
      </ToggleButtonGroup>
    </Box>
  );
};

export default ManageAlertsChannels;
