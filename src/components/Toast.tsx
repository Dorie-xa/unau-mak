"use client";

import { useEffect, useState, createContext, useContext, useCallback, ReactNode } from "react";

type ToastContextType = { show: (message: string, ok?: boolean) => void };
const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [isOk, setIsOk] = useState(true);
  const [visible, setVisible] = useState(false);

  const show = useCallback((message: string, ok = true) => {
    setMsg(message);
    setIsOk(ok);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className={`toast ${visible ? "show" : ""} ${isOk ? "" : "toast-error"}`}>
        {isOk ? "✅" : "⚠️"} {msg}
      </div>
    </ToastContext.Provider>
  );
}
