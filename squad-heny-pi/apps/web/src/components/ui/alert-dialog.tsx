"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info" | "confirm";

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
  onClose: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
}

const typeConfig: Record<
  AlertType,
  {
    bgColor: string;
    borderColor: string;
    iconBg: string;
    buttonColor: string;
    textColor: string;
    icon: React.ReactNode;
  }
> = {
  success: {
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconBg: "bg-green-100",
    buttonColor: "bg-green-600 hover:bg-green-700",
    textColor: "text-green-800",
    icon: "✓",
  },
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconBg: "bg-red-100",
    buttonColor: "bg-red-600 hover:bg-red-700",
    textColor: "text-red-800",
    icon: "✕",
  },
  warning: {
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconBg: "bg-yellow-100",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    textColor: "text-yellow-800",
    icon: "⚠",
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-100",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    textColor: "text-blue-800",
    icon: "ℹ",
  },
  confirm: {
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    iconBg: "bg-slate-100",
    buttonColor: "bg-[#51A471] hover:bg-[#3d8a56]",
    textColor: "text-slate-800",
    icon: "?",
  },
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose,
  onConfirm,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
}) => {
  const config = typeConfig[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div
              className={`${config.bgColor} border ${config.borderColor} rounded-xl shadow-2xl max-w-sm w-full overflow-hidden`}
            >
              {/* Header */}
              <div className="flex items-start gap-3 p-6 pb-4">
                <div
                  className={`${config.iconBg} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <span className={`${config.textColor} text-lg font-bold`}>
                    {config.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className={`${config.textColor} text-lg font-semibold`}>
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className={`${config.textColor} opacity-60 hover:opacity-100 transition-opacity`}
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message */}
              <div
                className={`px-6 pb-6 ${config.textColor} text-sm leading-relaxed`}
              >
                {message}
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 pt-0 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {cancelText}
                </button>
                {(type === "confirm" || onConfirm) && (
                  <button
                    onClick={() => {
                      onConfirm?.();
                      onClose();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${config.buttonColor} transition-colors`}
                  >
                    {confirmText}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
