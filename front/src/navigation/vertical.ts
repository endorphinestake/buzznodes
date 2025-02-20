// ** Hooks
import { useTranslation } from "react-i18next";
import { useDomain } from "@context/DomainContext";

// ** Icon imports
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import { ChartAreaspline } from "mdi-material-ui";
import { AccountDetails, Bridge, BellCog } from "mdi-material-ui";

// ** Types & Interfaces imports
import { VerticalNavItemsType } from "src/@core/layouts/types";
import { Permissions } from "@configs/acl";

const navigation = (): VerticalNavItemsType => {
  const { t } = useTranslation();
  const { isDaEnabled } = useDomain();

  return [
    {
      title: t(`Validators`),
      icon: DashboardIcon,
      path: "/",
      action: "read",
      subject: Permissions.ANY,
    },
    ...(isDaEnabled
      ? [
          {
            title: t(`Bridges`),
            icon: Bridge,
            path: "/bridges",
            action: "read",
            subject: Permissions.ANY,
          },
        ]
      : []),
    // {
    //   title: t(`Validator Details`),
    //   icon: AccountDetails,
    //   path: "/details",
    //   action: "read",
    //   subject: Permissions.ANY,
    // },
    {
      title: t(`Charts`),
      icon: ChartAreaspline,
      path: "/charts",
      action: "read",
      subject: Permissions.ANY,
    },
    {
      title: t(`Manage Alerts`),
      icon: BellCog,
      path: "/alerts",
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
