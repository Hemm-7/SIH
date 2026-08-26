import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Razorpay-AI-Builders reskin: sharp corners (no pill/rounded shape at
  // all), rigid mono labels, and hard instant-invert on hover instead of a
  // soft opacity fade — "no smooth fades, no soft transitions" per spec.
  // Focus-visible ring is untouched: accessibility keeps working regardless
  // of the new hover style.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border font-mono text-sm font-medium uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:bg-background hover:text-primary",
        accent:
          "border-accent bg-accent text-accent-foreground hover:bg-background hover:text-accent",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-background hover:text-destructive",
        outline:
          "border-input bg-background hover:bg-foreground hover:text-background",
        secondary:
          "border-secondary bg-secondary text-secondary-foreground hover:bg-background hover:text-secondary-foreground",
        ghost: "border-transparent hover:bg-secondary hover:text-secondary-foreground",
        link: "border-transparent text-accent underline-offset-4 hover:underline",
      },
      size: {
        // design-brief.md: citizen-facing surfaces need large touch targets.
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11",
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
