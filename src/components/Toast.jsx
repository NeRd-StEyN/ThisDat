import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((message, type = 'info', title = '', duration = 3500) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, title, exiting: false }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const success = useCallback((message, title = 'Success') => addToast(message, 'success', title), [addToast]);
  const error = useCallback((message, title = 'Error') => addToast(message, 'error', title), [addToast]);
  const warning = useCallback((message, title = 'Warning') => addToast(message, 'warning', title), [addToast]);
  const info = useCallback((message, title = 'Info') => addToast(message, 'info', title), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <div
              key={toast.id}
              className={`toast toast--${toast.type}${toast.exiting ? ' toast--exit' : ''}`}
              role="alert"
            >
              <Icon className="toast__icon" size={20} />
              <div className="toast__content">
                {toast.title && <div className="toast__title">{toast.title}</div>}
                <div className="toast__message">{toast.message}</div>
              </div>
              <button className="toast__close" onClick={() => removeToast(toast.id)} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
