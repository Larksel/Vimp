import { ComponentPropsWithRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@renderer/utils/utils';

const buttonVariants = cva(
  'flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer text-text-primary select-none',
  {
    variants: {
      variant: {
        default:
          'bg-elevated-base hover:bg-elevated-highlight active:bg-elevated-active',
        surface:
          'bg-transparent hover:bg-surface-highlight active:bg-surface-active rounded-none',
        glass:
          'bg-glass-base hover:bg-glass-highlight active:bg-glass-active text-text-secondary hover:text-text-primary',
        destructive: 'bg-danger',
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
  extends ComponentPropsWithRef<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
};
Button.displayName = 'Button';

export { Button, buttonVariants };
