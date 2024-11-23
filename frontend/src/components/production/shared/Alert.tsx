import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'warning';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const colors = {
    error: 'bg-red-50 text-red-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
  };

  const icons = {
    error: XCircle,
    success: CheckCircle,
    warning: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`p-4 rounded flex items-center justify-between ${colors[type]} mb-4`}>
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-2" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
