import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-linear-to-r from-[#2A7B9B] via-[#57C785] to-[#EDDD53] text-slate-900 shadow-md hover:brightness-95",
        secondary:
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
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