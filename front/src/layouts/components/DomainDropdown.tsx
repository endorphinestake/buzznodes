// ** React Imports
import { MouseEvent, useState } from "react";

// ** Hooks Imports
import { useDomain } from "@context/DomainContext";

// ** MUI Imports
import {
  Menu,
  MenuItem,
  Button,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const DomainDropdown = () => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // ** Hooks
  const { domain, name, logo: Logo, domains } = useDomain();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="secondary"
        aria-haspopup="true"
        onClick={handleClick}
        aria-controls="customized-menu"
        sx={{ mr: 10, mt: 2 }}
      >
        <Logo /> {name}
      </Button>
      <Menu
        keepMounted
        elevation={0}
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {Object.entries(domains)
          .filter(
            ([domainName]) =>
              (domain.includes("celestia") &&
                domainName.includes("celestia")) ||
              (domain.includes("0g") && domainName.includes("0g")) ||
              (domain.includes("xrpl") && domainName.includes("xrpl")) ||
              (domain.includes("story") && domainName.includes("story"))
          )
          .map(([domainName, domainData]) =>
            domainName !== domain ? (
              <MenuItem
                key={domainName}
                onClick={() => {
                  window.location.href = `https://${domainData.domain}`;
                }}
              >
                <ListItemIcon>
                  <domainData.logo fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={domainData.name} />
              </MenuItem>
            ) : null
          )}
      </Menu>
    </div>
  );
};

export default DomainDropdown;
