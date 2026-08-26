import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#141414] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#141414] text-[#F4EFE6] shadow-xs",
        secondary:
          "border-[#141414]/20 bg-black/[0.04] text-[#141414] font-bold",
        destructive:
          "border-[#141414] bg-[#141414] text-[#F4EFE6]",
        outline: "border-[#141414]/30 text-[#141414] bg-white font-bold",
        accent:
          "border-[#141414] bg-[#141414] text-[#F4EFE6] font-bold",
        glow:
          "border-[#141414]/30 bg-black/[0.05] text-[#141414] font-bold",
        neon:
          "border-[#141414]/30 bg-black/[0.05] text-[#141414] font-bold",
        amber:
          "border-[#141414]/30 bg-black/[0.05] text-[#141414] font-bold",
        blue:
          "border-[#141414]/30 bg-black/[0.05] text-[#141414] font-bold",
        success:
          "border-[#141414]/30 bg-black/[0.05] text-[#141414] font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
