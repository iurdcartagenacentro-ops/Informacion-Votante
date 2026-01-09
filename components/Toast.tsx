
import React, { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-emerald-600' : 'bg-blue-600';
  const Icon = type === 'success' ? CheckCircle : Info;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`${bgColor} text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10`}>
        <Icon className="w-5 h-5" />
        <span className="font-medium text-sm whitespace-nowrap">{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
