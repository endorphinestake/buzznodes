// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Types & Interfaces Imports
import { TBlockchainValidatorDetail } from "@modules/blockchains/types";

// ** MUI Imports
import { Card } from "@mui/material";

const ValidatorJailedStatus = ({
  validator,
}: {
  validator: TBlockchainValidatorDetail;
}) => {
  // ** Hooks
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        border: 0,
        boxShadow: 0,
        color: "common.black",
        backgroundColor: validator.jailed
          ? "rgba(255, 77, 73, 0.12)"
          : "rgba(114, 225, 40, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100px",
      }}
    >
      {validator.jailed ? t(`Jailed`) : t(`Not Jailed`)}
    </Card>
  );
};

export default ValidatorJailedStatus;
