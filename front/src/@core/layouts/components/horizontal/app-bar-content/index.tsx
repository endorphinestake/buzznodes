// ** React Imports
import { ReactNode } from "react";

// ** Next Import
import Link from "next/link";
import Image from "next/image";

// ** MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import logoPreview from "public/images/favicon.png";

// ** Type Import
import { Settings } from "src/@core/context/settingsContext";

// ** Theme Config Import
import themeConfig from "src/configs/themeConfig";

interface Props {
  hidden: boolean;
  settings: Settings;
  saveSettings: (values: Settings) => void;
  horizontalAppBarContent?: (props?: any) => ReactNode;
  horizontalAppBarBranding?: (props?: any) => ReactNode;
}

const StyledLink = styled("a")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  marginRight: theme.spacing(8),
}));

const AppBarContent = (props: Props) => {
  // ** Props
  const {
    horizontalAppBarContent: userHorizontalAppBarContent,
    horizontalAppBarBranding: userHorizontalAppBarBranding,
  } = props;

  // ** Hooks
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {userHorizontalAppBarBranding ? (
        userHorizontalAppBarBranding(props)
      ) : (
        <Link href="/" passHref>
          <StyledLink>
            <Image
              src={logoPreview}
              alt="BuzzNodes Logo"
              width={50}
              height={50}
              priority={false}
            />

            <Typography
              variant="h6"
              sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}
            >
              {themeConfig.templateName}
            </Typography>
          </StyledLink>
        </Link>
      )}
      {userHorizontalAppBarContent ? userHorizontalAppBarContent(props) : null}
    </Box>
  );
};

export default AppBarContent;
