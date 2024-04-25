import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'group relative flex w-full touch-none select-none items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-1 w-full grow overflow-hidden rounded-full bg-white/20'>
      <SliderPrimitive.Range className='absolute h-full rounded-full bg-white transition-colors group-hover:bg-red-500' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='block size-0 rounded-full bg-white shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group-hover:size-4' />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
