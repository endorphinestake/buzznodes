import { memo, ReactNode } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleClose?: () => void;
  title: string;
  maxWidth?: "xs" | "sm" | "md" | "xl";
  content: ReactNode;
}

const DialogComponent = (props: IProps) => {
  const { open, setOpen, handleClose, title, maxWidth, content } = props;

  const onClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      maxWidth={maxWidth || "xs"}
      fullWidth={true}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
    >
      <DialogTitle>
        <>
          {title}
          <IconButton
            color="inherit"
            size="small"
            onClick={handleClose || onClose}
            aria-label="close"
            sx={{ position: "absolute", right: 4, top: 4 }}
          >
            <Close />
          </IconButton>
        </>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "left",
          textAlign: "left",
        }}
      >
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default memo(DialogComponent);
