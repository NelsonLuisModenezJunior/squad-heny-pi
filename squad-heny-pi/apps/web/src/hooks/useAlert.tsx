"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { toast as sonnerToast, Toaster } from "sonner";
import { AlertDialog, AlertType } from "@/components/ui/alert-dialog";

interface AlertContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
  };
  dialog: {
    confirm: (title: string, message: string, onConfirm?: () => void) => void;
    alert: (title: string, message: string, type?: AlertType) => void;
  };
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const handleCloseDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const alertContextValue: AlertContextType = {
    toast: {
      success: (message: string) =>
        sonnerToast.success(message, {
          duration: 3000,
          style: {
            backgroundColor: "#ecfdf5",
            color: "#065f46",
            border: "1px solid #a7f3d0",
            borderRadius: "0.75rem",
          },
        }),
      error: (message: string) =>
        sonnerToast.error(message, {
          duration: 3000,
          style: {
            backgroundColor: "#fef2f2",
            color: "#7f1d1d",
            border: "1px solid #fecaca",
            borderRadius: "0.75rem",
          },
        }),
      warning: (message: string) =>
        sonnerToast.warning(message, {
          duration: 3000,
          style: {
            backgroundColor: "#fffbeb",
            color: "#78350f",
            border: "1px solid #fcd34d",
            borderRadius: "0.75rem",
          },
        }),
      info: (message: string) =>
        sonnerToast.info(message, {
          duration: 3000,
          style: {
            backgroundColor: "#eff6ff",
            color: "#0c2340",
            border: "1px solid #bfdbfe",
            borderRadius: "0.75rem",
          },
        }),
    },
    dialog: {
      confirm: (title: string, message: string, onConfirm?: () => void) => {
        setDialogState({
          isOpen: true,
          title,
          message,
          type: "confirm",
          onConfirm,
        });
      },
      alert: (title: string, message: string, type: AlertType = "info") => {
        setDialogState({
          isOpen: true,
          title,
          message,
          type,
        });
      },
    },
  };

  return (
    <AlertContext.Provider value={alertContextValue}>
      <AlertDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
        onClose={handleCloseDialog}
        onConfirm={dialogState.onConfirm}
      />
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="light"
        expand
      />
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
