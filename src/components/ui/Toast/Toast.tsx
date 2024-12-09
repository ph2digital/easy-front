import React, { useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
  className?: string;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'bg-green-100 text-green-800 border-green-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
};

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 3000,
  className,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 flex items-center p-4 rounded-lg border shadow-lg",
        colors[type],
        className
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 p-1 hover:bg-opacity-20 hover:bg-black rounded-full transition-colors"
        aria-label="Close notification"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};