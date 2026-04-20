import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = ({ className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur",
        className
      )}
      {...props}
    />
  );
};

export default Card;