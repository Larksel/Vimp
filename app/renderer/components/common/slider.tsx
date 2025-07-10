import { forwardRef, ComponentRef, ComponentPropsWithoutRef } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@render-utils/utils';

const Slider = forwardRef<
  ComponentRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'group relative flex w-full touch-none items-center py-1 select-none',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className='bg-text-sub relative h-1 w-full grow overflow-hidden rounded-full'>
      <SliderPrimitive.Range className='bg-base group-hover:bg-accent absolute h-full rounded-full transition-colors' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='bg-base focus-visible:ring-text-secondary block size-0 rounded-full shadow-sm transition-all group-hover:size-4 focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50' />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
