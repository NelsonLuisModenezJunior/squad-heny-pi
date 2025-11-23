"use client";

import React from "react";
import { X } from "lucide-react";

type Variant = "info" | "success" | "warning" | "error";

const variantStyles: Record<Variant, string> = {
  info: "bg-blue-50 text-blue-800 border-blue-100",
  success: "bg-green-50 text-green-800 border-green-100",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-100",
  error: "bg-red-50 text-red-800 border-red-100",
};

const iconFor = (variant: Variant) => {
  switch (variant) {
    case "success":
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "warning":
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94A2 2 0 0 0 23 18L14.53 3.86a2 2 0 0 0-3.46 0z" />
        </svg>
      );
    case "error":
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18.36 6.64L6.64 18.36M6.64 6.64L18.36 18.36" />
        </svg>
      );
    default:
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      );
  }
};

interface AlertProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: Variant;
  onClose?: () => void;
  dismissible?: boolean;
}

export function Alert({
  title,
  description,
  variant = "info",
  onClose,
  dismissible = true,
}: AlertProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full max-w-md border rounded-lg shadow-sm px-4 py-3 flex items-start gap-3 ${variantStyles[variant]}`}
    >
      <div className="mt-0.5">{iconFor(variant)}</div>
      <div className="flex-1">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {dismissible && (
        <button
          aria-label="Fechar alerta"
          className="ml-2 text-current opacity-80 hover:opacity-100"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
