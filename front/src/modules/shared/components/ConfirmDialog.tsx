// ** React Imports
import { ReactNode } from "react";

// ** Mui Imports
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface IProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirm: () => void;
  title: string;
  children?: ReactNode;
}

const ConfirmDialog = (props: IProps) => {
  const { open, setOpen, onConfirm, title, children } = props;

  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    handleClose();
    onConfirm();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions className="dialog-actions-dense">
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
