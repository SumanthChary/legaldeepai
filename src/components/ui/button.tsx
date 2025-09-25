
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium font-aeonik ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md font-medium",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md",
        outline: "border-2 border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md font-medium",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm hover:shadow-md font-medium",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm hover:shadow-md font-medium",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        premium: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl border border-accent/20 font-semibold",
        professional: "bg-background text-primary border-2 border-muted hover:border-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-lg font-medium",
      },
      size: {
        default: "h-8 px-3 py-1.5 text-xs sm:h-9 sm:px-4 sm:py-2 sm:text-sm md:h-10 md:px-4 md:py-2 md:text-sm",
        sm: "h-7 px-2 py-1 text-xs sm:h-8 sm:px-3 sm:text-xs md:h-8 md:rounded-lg md:px-3 md:text-xs",
        lg: "h-9 px-4 py-2 text-sm sm:h-10 sm:px-5 sm:py-2.5 sm:text-base md:h-12 md:px-6 md:text-base lg:rounded-lg",
        icon: "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10",
        "icon-sm": "h-7 w-7 sm:h-8 sm:w-8",
        "icon-lg": "h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
