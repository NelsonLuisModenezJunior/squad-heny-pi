"use client";

import React from "react";
import { motion } from "framer-motion";
import { Alert } from "./alert";

type Variant = "info" | "success" | "warning" | "error";

interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: Variant;
  onClose: (id: string) => void;
}

export function Toast({
  id,
  title,
  description,
  variant = "info",
  onClose,
}: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      layout
      transition={{ duration: 0.18 }}
      className="mb-2"
    >
      <Alert
        title={title}
        description={description}
        variant={variant}
        onClose={() => onClose(id)}
      />
    </motion.div>
  );
}

export default Toast;
