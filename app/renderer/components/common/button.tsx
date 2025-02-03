import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@render-utils/utils';

const buttonVariants = cva(
  'flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer text-text-primary',
  {
    variants: {
      variant: {
        default:
          'bg-background-elevated-base hover:bg-background-elevated-highlight active:bg-background-elevated-click',
        surface:
          'bg-transparent hover:bg-background-surface-highlight active:bg-background-surface-click rounded-none',
        glass:
          'bg-background-glass-base hover:bg-background-glass-highlight active:bg-background-glass-click text-text-secondary hover:text-text-primary',
        destructive: 'bg-essential-danger',
        outline:
          'border border-text-secondary text-text-secondary hover:bg-text-primary hover:text-text-black',
        filled: 'bg-text-primary text-text-black',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
