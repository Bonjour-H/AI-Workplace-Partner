import React, { useState, useEffect } from 'react';

let toastCounter = 0;
let showToastFn = null;

// 全局Toast函数
export const showToast = (message, type = 'error') => {
  if (showToastFn) {
    showToastFn(message, type);
  }
};

function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToastFn = (message, type) => {
      const id = ++toastCounter;
      const newToast = { id, message, type };
      
      setToasts(prev => [...prev, newToast]);
      
      // 3秒后自动移除
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 3000);
    };
    
    return () => {
      showToastFn = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed top-5 right-1/2 translate-x-1/2 z-50 space-y-2">
      {toasts.map(toast => {
        const bgColor = toast.type === 'success' ? 'bg-blue-600' : 'bg-red-500';
        
        return (
          <div
            key={toast.id}
            className={`${bgColor} text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg animate-fade-in`}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}

export default Toast; 