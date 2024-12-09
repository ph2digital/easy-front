import { useState, useCallback } from 'react';
import { ToastType } from '../components/ui/Toast/Toast';

interface ToastState {
  type: ToastType;
  message: string;
  id: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { type, message, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
};