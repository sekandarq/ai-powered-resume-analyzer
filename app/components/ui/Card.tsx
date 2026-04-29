import type { HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = ({ className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-[rgba(104,129,163,0.24)] bg-[linear-gradient(145deg,rgba(255,255,255,0.94)_0%,rgba(241,248,255,0.82)_42%,rgba(236,252,247,0.78)_100%)] p-6 shadow-[0_34px_90px_-44px_rgba(15,23,42,0.36),0_12px_24px_-18px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(148,163,184,0.12)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
};

export default Card;
