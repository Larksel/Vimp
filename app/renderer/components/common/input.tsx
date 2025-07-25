import { InputHTMLAttributes, forwardRef } from 'react';

import { cn } from '@renderer/utils/utils';

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'bg-elevated-highlight focus:bg-elevated-active placeholder:text-text-secondary flex w-full px-3 py-2 text-sm file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
