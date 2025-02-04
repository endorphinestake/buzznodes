// ** Hooks
import { useTranslation } from "react-i18next";

// ** Icon imports
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import { ChartAreaspline } from "mdi-material-ui";
import { AccountDetails } from "mdi-material-ui";

// ** Types & Interfaces imports
import { VerticalNavItemsType } from "src/@core/layouts/types";
import { Permissions } from "@configs/acl";

const navigation = (): VerticalNavItemsType => {
  const { t } = useTranslation();

  return [
    {
      title: t(`Validators`),
      icon: DashboardIcon,
      path: "/",
      action: "read",
      subject: Permissions.ANY,
    },
    {
      title: t(`Validator Details`),
      icon: AccountDetails,
      path: "/details",
      action: "read",
      subject: Permissions.ANY,
    },
    {
      title: t(`Charts`),
      icon: ChartAreaspline,
      path: "/charts",
      action: "read",
      subject: Permissions.ANY,
    },
    {
      title: t(`Settings`),
      icon: SettingsIcon,
      path: "/settings",
      action: "read",
      subject: Permissions.ANY,
    },
  ];
};

export default navigation;
