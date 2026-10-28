import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef();
  const notify = useCallback(text => {
    setMsg(text);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 3200);
  }, []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className={`toast${show ? " show" : ""}`} role="status">{msg}</div>
    </ToastContext.Provider>
  );
}
