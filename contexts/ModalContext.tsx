"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { createContext, ReactNode, useContext, useState } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  showModal: (options: ConfirmOptions) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

interface ModalState extends ConfirmOptions {
  isOpen: boolean;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const showModal = (options: ConfirmOptions): void => {
    setModalState({
      ...options,
      isOpen: true,
    });
  };

  const handleClose = () => {
    if (modalState?.onCancel) {
      modalState.onCancel();
    }
    setModalState(null);
  };

  const handleConfirm = () => {
    if (modalState?.onConfirm) {
      modalState.onConfirm();
    }
    setModalState(null);
  };

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {modalState && (
        <Modal
          isOpen={modalState.isOpen}
          onClose={handleClose}
          title={modalState.title}
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              {modalState.message}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {modalState.cancelText || "Cancel"}
              </Button>
              <Button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  modalState.variant === "danger"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {modalState.confirmText || "Confirm"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </ModalContext.Provider>
  );
}
