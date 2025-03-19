// ** Hooks Imports
import { useTranslation } from "react-i18next";

// ** Utils Imports
import { formatShortText } from "@modules/shared/utils/text";

// ** Types & Interfaces Imports
import { TBlockchainValidatorDetail } from "@modules/blockchains/types";

// ** Shared Components Imports
import Notify from "@modules/shared/utils/Notify";

// ** MUI Imports
import { Box, Card, Typography, CardContent, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface DataType {
  title: string;
  value?: string;
}

const ValidatorHashes = ({
  validator,
}: {
  validator: TBlockchainValidatorDetail;
}) => {
  // ** Hooks
  const { t } = useTranslation();

  // ** Vars
  const data: DataType[] = [
    {
      title: t("Operator Address"),
      value: validator.operator_address,
    },
    {
      title: t("Wallet Address"),
      value: validator.wallet_address,
    },
    {
      title: t("HEX Address"),
      value: validator.hex_address,
    },
    {
      title: t("Valcons Address"),
      value: validator.valcons_address,
    },
    {
      title: t("Consensus pubkey"),
      value: validator.pubkey_key,
    },
  ];

  return (
    <Card>
      <CardContent sx={{ pb: (theme) => `${theme.spacing(6.5)} !important` }}>
        {data.map((item: DataType, index: number) => {
          return (
            <Box
              key={item.title}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: index !== data.length - 1 ? 7.25 : undefined,
              }}
            >
              <Box
                sx={{
                  ml: 3,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ mr: 2, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {item.title}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {item.value ? (
                    <Tooltip title={item.value}>
                      <Box
                        component="span"
                        onClick={() => {
                          navigator.clipboard.writeText(item.value ?? "");
                          Notify("success", t(`Copied to clipboard`));
                        }}
                        sx={{
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {formatShortText(item.value ?? "", 12)}
                        <ContentCopyIcon
                          fontSize="inherit"
                          sx={{ marginLeft: "4px", verticalAlign: "middle" }}
                        />
                      </Box>
                    </Tooltip>
                  ) : null}
                </Box>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ValidatorHashes;
