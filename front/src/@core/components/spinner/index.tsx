// ** MUI Import
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import logoPreview from "public/images/favicon.png";

const FallbackSpinner = () => {
  // ** Hook
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Image
        src={logoPreview}
        alt="BuzzNodes Logo"
        width={50}
        height={50}
        priority={false}
      />

      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  );
};

export default FallbackSpinner;
