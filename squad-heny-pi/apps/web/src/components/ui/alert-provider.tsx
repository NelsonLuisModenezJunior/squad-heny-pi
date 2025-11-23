"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import Toast from "./toast";

type Variant = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: Variant;
  duration?: number; // ms
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  showToast: (opts: ToastOptions) => string;
  closeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useAlert() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, number>>({});

  useEffect(() => {
    return () => {
      // cleanup timers
      Object.values(timers.current).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const showToast = (opts: ToastOptions) => {
    const id = Math.random().toString(36).slice(2, 9);
    const duration = opts.duration ?? 3000;
    const item: ToastItem = { id, ...opts, duration };
    setToasts((s) => [item, ...s]);

    const t = window.setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
      delete timers.current[id];
    }, duration);

    timers.current[id] = t;
    return id;
  };

  const closeToast = (id: string) => {
    setToasts((s) => s.filter((x) => x.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  };

  const value = useMemo(() => ({ showToast, closeToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof window !== "undefined" &&
        createPortal(
          <div className="fixed z-50 right-4 top-4 w-auto max-w-[calc(100%-2rem)] pointer-events-none">
            <div className="flex flex-col items-end pointer-events-auto">
              <AnimatePresence initial={false}>
                {toasts.map((t) => (
                  <Toast
                    key={t.id}
                    id={t.id}
                    title={t.title}
                    description={t.description}
                    variant={t.variant}
                    onClose={closeToast}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export default AlertProvider;
