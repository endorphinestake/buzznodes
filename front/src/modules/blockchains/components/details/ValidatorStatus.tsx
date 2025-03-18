// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Types & Interfaces Imports
import { TBlockchainValidatorDetail } from "@modules/blockchains/types";
import { EBlockchainValidatorStatus } from "@modules/blockchains/enums";

// ** MUI Imports
import { Card } from "@mui/material";

const ValidatorStatus = ({
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
        backgroundColor:
          validator.status === EBlockchainValidatorStatus.BOND_STATUS_BONDED
            ? "rgba(114, 225, 40, 0.12)"
            : "rgba(255, 77, 73, 0.12);",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100px",
      }}
    >
      {validator.status === EBlockchainValidatorStatus.BOND_STATUS_BONDED
        ? t(`Active`)
        : t(`Inactive`)}
    </Card>
  );
};

export default ValidatorStatus;
