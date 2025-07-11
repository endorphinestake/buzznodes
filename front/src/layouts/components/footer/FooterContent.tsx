// ** MUI Imports
import Box from "@mui/material/Box";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography sx={{ mr: 2 }}>
        {`Copyright © ${new Date().getFullYear()} Endorphine Stake. All rights reserved.`}
      </Typography>
    </Box>
  );
};

export default FooterContent;
