import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Potwierdź",
  variant = "default",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
        >
          Anuluj
        </button>
        <button
          onClick={handleConfirm}
          className={
            variant === "danger"
              ? "px-4 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              : "px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          }
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
