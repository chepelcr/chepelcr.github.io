import { ReactNode } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface HintProps {
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  /** When true (or label empty) the child renders without a tooltip. */
  disabled?: boolean;
  children: ReactNode;
}

/** Styled tooltip wrapper (shadcn/Radix) — replaces unstyled native `title`. */
export function Hint({ label, side = "right", disabled, children }: HintProps) {
  if (disabled || !label) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
}
