import { createContext } from "react";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface ToastContextValue {
  showToast: (opts: Omit<ToastItem, "id">) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
