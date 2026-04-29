import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-linear-to-r from-teal-700 via-teal-500 to-lime-500 text-white shadow-[0_18px_34px_-18px_rgba(13,148,136,0.65)] hover:-translate-y-0.5 hover:brightness-95",
        secondary:
          "border border-slate-200/80 bg-white/85 text-slate-700 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.4)] hover:-translate-y-0.5 hover:bg-white hover:text-slate-950",
        ghost: "bg-transparent text-slate-700 hover:bg-white/60 hover:text-slate-950",
      },
      size: {
        sm: "px-3.5 py-2 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3.5 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = ({
  className,
  variant,
  size,
  fullWidth,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
};

export default Button;
