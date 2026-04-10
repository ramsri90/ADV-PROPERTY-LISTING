'use client';

import { createContext, ReactNode, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Info, TriangleAlert } from 'lucide-react';

type ToastTone = 'success' | 'info' | 'warning';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneStyles: Record<ToastTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  info: 'border-blue-200 bg-blue-50 text-blue-950',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
};

const toneIcons = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
} satisfies Record<ToastTone, typeof CheckCircle2>;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextToastId = useRef(1);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast(message, tone = 'info') {
        const id = nextToastId.current++;

        setToasts((current) => [...current, { id, message, tone }]);

        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 2600);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-6 z-[70] flex flex-col items-end gap-3 sm:inset-x-6">
        {toasts.map((toast) => {
          const Icon = toneIcons[toast.tone];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${toneStyles[toast.tone]}`}
            >
              <Icon size={18} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
