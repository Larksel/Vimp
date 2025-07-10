import { forwardRef, ComponentRef, ComponentPropsWithoutRef } from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@render-utils/utils';

const ScrollArea = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className='h-full w-full rounded-[inherit] *:h-full'>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none transition-colors select-none',
      orientation === 'vertical' && 'h-full w-1',
      orientation === 'horizontal' && 'h-1 flex-col',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className='bg-elevated-highlight relative flex-1 rounded-full' />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
