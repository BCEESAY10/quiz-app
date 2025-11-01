export type ToastType = "success" | "error" | "warning";

export type ToastState = {
  message: string;
  type: "success" | "error" | "warning";
};

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}
