import type { TextareaHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-[inset_0_0_12px_rgba(36,99,235,0.14)] outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200",
        className
      )}
      {...props}
    />
  );
};

export default Textarea;