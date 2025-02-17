// components/Modal.tsx
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-[70%] flex flex-col gap-5">
        <button
          onClick={onClose}
          className="absolute text-gray-600 top-2 right-2 hover:text-gray-900"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
