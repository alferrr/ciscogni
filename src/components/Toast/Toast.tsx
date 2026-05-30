"use client";
import { useEffect, useState } from "react";
import "./Toast.css";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaCircleInfo,
  FaXmark,
} from "react-icons/fa6";
import { ToastMessage, ToastType } from "@/context/ToastContext";

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const icons = {
  success: <FaCircleCheck />,
  error: <FaCircleXmark />,
  info: <FaCircleInfo />,
};

const ToastItem = ({
  toast,
  removeToast,
}: {
  toast: ToastMessage;
  removeToast: (id: string) => void;
}) => {
  const [exiting, setExiting] = useState(false);

  const handleRemove = () => {
    setExiting(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => removeToast(toast.id), 300);
    }, 2700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast toast-${toast.type} ${exiting ? "toast-exit" : ""}`}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <p className="toast-message">{toast.message}</p>
      <button className="toast-close" onClick={handleRemove}>
        <FaXmark />
      </button>
    </div>
  );
};

const Toast = ({ toasts, removeToast }: ToastProps) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export default Toast;
