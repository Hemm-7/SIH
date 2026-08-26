import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C2925] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#2C2925] text-[#ECE7DC] hover:bg-[#1E1C1A] shadow-sm",
        accent: "bg-[#2C2925] text-[#ECE7DC] hover:bg-[#1E1C1A] shadow-sm",
        destructive: "bg-[#2C2925] text-[#ECE7DC] hover:bg-[#1E1C1A] shadow-sm",
        outline:
          "border-2 border-[#2C2925] bg-transparent text-[#2C2925] hover:bg-[#2C2925] hover:text-[#ECE7DC]",
        secondary:
          "bg-[#DDD8CD] text-[#2C2925] hover:bg-[#D0CAC0] border border-[#2C2925]/20",
        ghost: "text-[#2C2925] hover:bg-black/[0.06]",
        link: "text-[#2C2925] underline-offset-4 hover:underline font-bold",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-sm px-3.5 text-xs",
        lg: "h-13 rounded-sm px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
