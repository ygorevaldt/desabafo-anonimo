import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-rose-500 hover:shadow-soft-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-muted border border-border/60",
        outline:
          "border border-border bg-transparent hover:bg-secondary text-foreground",
        ghost: "hover:bg-secondary text-foreground",
        warm: "bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-soft hover:shadow-soft-md hover:from-rose-600 hover:to-rose-500",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 rounded-2xl",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-12 rounded-3xl px-8 text-base",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
