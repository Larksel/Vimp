import { forwardRef, ComponentRef, ComponentPropsWithoutRef } from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@render-utils/utils';

const Switch = forwardRef<
  ComponentRef<typeof SwitchPrimitives.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer focus-visible:ring-text-primary focus-visible:ring-offset-text-primary data-[state=checked]:bg-accent data-[state=unchecked]:bg-text-secondary inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'bg-text-black pointer-events-none block h-5 w-5 rounded-full ring-0 shadow-lg transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
