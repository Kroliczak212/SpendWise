import { useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContext, type ToastItem } from "./toastContext";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((opts: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full sm:w-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
                toast.type === "success"
                  ? "bg-green-600"
                  : toast.type === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
              }`}
            >
              <span className="text-base">
                {toast.type === "success" ? "✓" : toast.type === "error" ? "✗" : "ℹ"}
              </span>
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                className="opacity-75 hover:opacity-100 text-lg leading-none"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
