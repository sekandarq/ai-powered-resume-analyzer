import type { InputHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-[inset_0_0_12px_rgba(36,99,235,0.14)] outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200",
        className
      )}
      {...props}
    />
  );
};

export default Input;