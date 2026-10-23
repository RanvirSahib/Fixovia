import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 220);
  }, []);

  const addToast = useCallback(({ message, type = 'info', duration }) => {
    const id = ++toastId;
    
    // Snappy, non-intrusive durations
    const defaultDurations = {
      info: 1400,     // 1.4s for quick informational updates
      success: 1800,  // 1.8s for success
      warning: 2400,  // 2.4s for warnings
      error: 3000,    // 3.0s for errors
    };
    const finalDuration = duration !== undefined ? duration : (defaultDurations[type] || 1600);

    setToasts((prev) => [...prev.slice(-3), { id, message, type, exiting: false }]);

    if (finalDuration > 0) {
      setTimeout(() => dismiss(id), finalDuration);
    }

    return id;
  }, [dismiss]);

  const toast = {
    success: (msg, opts) => addToast({ message: msg, type: 'success', ...opts }),
    error:   (msg, opts) => addToast({ message: msg, type: 'error',   ...opts }),
    info:    (msg, opts) => addToast({ message: msg, type: 'info',    ...opts }),
    warning: (msg, opts) => addToast({ message: msg, type: 'warning', ...opts }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '360px',
      width: 'calc(100vw - 48px)',
      pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const colors = {
    success: { bg: '#f0fdf4', border: '#86efac', icon: '#16a34a', text: '#14532d' },
    error:   { bg: '#fff1f2', border: '#fda4af', icon: '#e11d48', text: '#881337' },
    warning: { bg: '#fffbeb', border: '#fcd34d', icon: '#d97706', text: '#78350f' },
    info:    { bg: '#eff6ff', border: '#93c5fd', icon: '#2563eb', text: '#1e3a8a' },
  };

  const icons = {
    success: '✓',
    error:   '✕',
    warning: '⚠',
    info:    'ℹ',
  };

  const c = colors[toast.type] || colors.info;

  return (
    <div
      className={toast.exiting ? 'animate-fade-out' : 'animate-slide-in-right'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '12px',
        boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
        opacity: toast.exiting ? 0 : 1,
        transform: toast.exiting ? 'translateX(30px) scale(0.96)' : 'translateX(0) scale(1)',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <span style={{
        flexShrink: 0,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: c.icon,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 800,
      }}>
        {icons[toast.type]}
      </span>
      <span style={{ fontSize: 13, color: c.text, flex: 1, lineHeight: 1.4, fontWeight: 600 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: c.icon,
          fontSize: 16,
          lineHeight: 1,
          padding: '2px 4px',
          opacity: 0.65,
          transition: 'opacity 0.15s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.65'}
      >
        ×
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
