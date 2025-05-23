import { Close } from "@mui/icons-material";
import {
  IconButton,
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
} from "@mui/material";
import React from "react";

export default function Dialog(props: DialogProps) {
  const { children, PaperProps, onClose, ...otherProps } = props;
  return (
    <MuiDialog
      PaperProps={{
        ...PaperProps,
        sx: { padding: 0.5, minWidth: 450, ...(PaperProps?.sx || {}) },
      }}
      onClose={onClose}
      {...otherProps}
    >
      <IconButton
        onClick={() => {
          if (onClose) {
            onClose({}, "closeButtonClick");
          }
        }}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <Close />
      </IconButton>
      {children}
    </MuiDialog>
  );
}

type DialogProps = Omit<MuiDialogProps, "onClose"> & {
  onClose?: (
    event: unknown,
    reason: "backdropClick" | "escapeKeyDown" | "closeButtonClick"
  ) => void;
};
