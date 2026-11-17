import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#1b4d77]",
        outline: "border border-input bg-card text-foreground hover:bg-muted",
        ghost: "text-primary hover:bg-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };
export function Button({
  asChild = false,
  className,
  variant,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
