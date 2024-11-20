import React from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
        <div className="relative bg-white rounded-lg max-w-lg w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;