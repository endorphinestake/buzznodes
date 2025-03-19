// ** NextJS Imports
import Link from "next/link";

// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Types & Interfaces Imports
import { TBlockchainValidatorDetail } from "@modules/blockchains/types";

// ** MUI Imports
import { Card, CardContent, Typography } from "@mui/material";
import { LinkVariant } from "mdi-material-ui";
import CustomAvatar from "src/@core/components/mui/avatar";

const ValidatorMoniker = ({
  validator,
}: {
  validator: TBlockchainValidatorDetail;
}) => {
  return (
    <Card>
      <CardContent
        sx={{
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <CustomAvatar skin="light" sx={{ width: 56, height: 56, mb: 2 }}>
          <img
            loading="lazy"
            width="56"
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
        </CustomAvatar>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {validator.moniker ?? "Unknown"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 6.5 }}>
          {validator.details}
        </Typography>

        {/* <Button
          variant="contained"
          sx={{ p: (theme) => theme.spacing(1.75, 5.5) }}
        >
          Contact Now
        </Button> */}

        {validator.website ? (
          <Typography
            component="a"
            href={validator.website}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "primary.main",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <LinkVariant sx={{ mr: 1.5, fontSize: "1rem" }} />
            <span>{validator.website}</span>
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ValidatorMoniker;
