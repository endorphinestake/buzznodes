// ** React Imports
import { Fragment } from "react";

// ** NextJS Imports
import Link from "next/link";

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

      <Link href={`/details?validator_id=${validator.id}`} passHref>
        <Typography
          variant="body2"
          className="link"
          sx={{
            color: "primary.main",
            fontWeight: 500,
            lineHeight: "22px",
            ml: 2,
          }}
        >
          {validator.moniker ?? "-----"}
        </Typography>
      </Link>
    </Fragment>
  );
};

export default ValidatorMonikerLabel;
