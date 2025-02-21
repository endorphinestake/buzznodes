// ** React Imports
import { Fragment } from "react";

// ** Types & Interfaces Imports
import { TBlockchainValidator } from "@modules/blockchains/types";

// ** MUI Imports
import { Typography } from "@mui/material";

const ValidatorMonikerLabel = ({
  validator,
}: {
  validator: TBlockchainValidator;
}) => {
  return (
    <Fragment>
      <img
        loading="lazy"
        width="25"
        src={
          validator.picture && validator.picture !== "default"
            ? validator.picture
            : "/images/defaultValidatorIcon.webp"
        }
        alt="validator icon"
        style={{
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: "text.primary",
          fontWeight: 500,
          lineHeight: "22px",
          ml: 2,
        }}
      >
        {validator.moniker ?? "-----"}
      </Typography>
    </Fragment>
  );
};

export default ValidatorMonikerLabel;
