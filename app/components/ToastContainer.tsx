import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useToastStore, type ToastType } from "~/lib/toast";

const toneMap: Record<
  ToastType,
  {
    wrapper: string;
    icon: ReactNode;
    iconColor: string;
  }
> = {
  success: {
    wrapper: "border-emerald-200 bg-emerald-50/95",
    icon: <CheckCircle2 className="h-5 w-5" />,
    iconColor: "text-emerald-700",
  },
  error: {
    wrapper: "border-red-200 bg-red-50/95",
    icon: <XCircle className="h-5 w-5" />,
    iconColor: "text-red-700",
  },
  info: {
    wrapper: "border-sky-200 bg-sky-50/95",
    icon: <Info className="h-5 w-5" />,
    iconColor: "text-sky-700",
  },
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[min(92vw,420px)] flex-col gap-3">
      {toasts.map((toast) => {
        const tone = toneMap[toast.type];

        return (
          <article
            key={toast.id}
            className={`pointer-events-auto animate-in slide-in-from-right-5 fade-in rounded-2xl border p-4 shadow-lg backdrop-blur ${tone.wrapper}`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className={tone.iconColor}>{tone.icon}</div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">{toast.title}</h3>
                {toast.description ? (
                  <p className="mt-1 text-sm text-slate-700">{toast.description}</p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="cursor-pointer rounded-md p-1 text-slate-500 transition hover:bg-white/70 hover:text-slate-800"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ToastContainer;