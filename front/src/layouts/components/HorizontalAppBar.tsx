// ** MUI Imports
import Box from "@mui/material/Box";

// ** Type Import
import { Settings } from "src/@core/context/settingsContext";

// ** Components
import ModeToggler from "src/@core/layouts/components/shared-components/ModeToggler";
import UserDropdown from "./UserDropdown";
import LanguageDropdown from "./LanguageDropdown";
import UserBalance from './UserBalance';

interface Props {
  hidden: boolean;
  settings: Settings;
  saveSettings: (values: Settings) => void;
}

const HorizontalAppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <UserBalance />
      <LanguageDropdown settings={settings} saveSettings={saveSettings} />
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      <UserDropdown settings={settings} />
    </Box>
  );
};

export default HorizontalAppBarContent;
