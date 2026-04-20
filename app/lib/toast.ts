import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
};

type ToastInput = Omit<Toast, "id">;

type ToastStore = {
  toasts: Toast[];
  addToast: (toast: ToastInput) => void;
  removeToast: (id: string) => void;
};

const defaultDuration = 3500;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID();
    const duration = toast.duration ?? defaultDuration;

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));