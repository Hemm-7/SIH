import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-sm border border-[#141414]/30 bg-[#FFFFFF] px-3.5 py-3 text-sm text-[#141414] placeholder:text-[#575249]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414] focus-visible:border-[#141414] disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm font-mono",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
