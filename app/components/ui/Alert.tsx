import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/utils";

type AlertTone = "success" | "error" | "info";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: AlertTone;
  icon?: ReactNode;
};

const toneClassMap: Record<AlertTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

const Alert = ({ className, tone = "info", icon, children, ...props }: AlertProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm",
        toneClassMap[tone],
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      {icon ? <span className="mt-0.5">{icon}</span> : null}
      <div>{children}</div>
    </div>
  );
};

export default Alert;