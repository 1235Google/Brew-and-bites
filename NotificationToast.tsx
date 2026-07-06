import React, { useEffect } from 'react';
import { ToastNotification } from '../types';
import { Bell, X, ShieldCheck } from 'lucide-react';

interface NotificationToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  isDarkMode: boolean;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss, isDarkMode }) => {
  if (toasts.length === 0) return null;
  const latestToast = toasts[0];
  return (
    <div 
      className="fixed top-28 right-4 z-50 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      id="notification-toast-anchor"
    >
      <ToastItem key={latestToast.id} toast={latestToast} onDismiss={onDismiss} isDarkMode={isDarkMode} />
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: (id: string) => void; isDarkMode: boolean }> = ({
  toast,
  onDismiss,
  isDarkMode
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div 
      className={`pointer-events-auto rounded-2xl p-4 shadow-xl flex items-start gap-3.5 w-full animate-slide-in-right relative overflow-hidden glass-panel border ${
        isDarkMode 
          ? 'bg-gray-950/80 border-white/10 text-white' 
          : 'bg-white/80 border-white/35 text-gray-950'
      }`}
      id={`toast-item-${toast.id}`}
    >
      {/* Premium secure-style colored accent strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500" />

      {/* Circle Icon Badge */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-indigo-500 select-none border ${
        isDarkMode ? 'bg-white/10 border-white/10' : 'bg-indigo-50 border-indigo-100'
      }`}>
        <span className="text-xl filter drop-shadow-sm">{toast.emoji}</span>
      </div>

      <div className="flex-1 min-w-0 pr-4 text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Brew & Bites System</span>
          <span className="text-[9px] text-gray-400">•</span>
          <span className="text-[9px] text-gray-400">Just now</span>
        </div>
        <p className={`text-xs font-bold mt-1.5 leading-normal ${
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>
          {toast.message}
        </p>
      </div>

      {/* Dismiss button */}
      <button 
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-gray-900 p-1 rounded-lg hover:bg-black/5 transition-colors absolute top-3.5 right-3.5 cursor-pointer"
        title="Dismiss alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
