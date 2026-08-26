import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
