import { useRef, useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/utils';

const textVariants = cva('w-fit whitespace-nowrap font-normal', {
  variants: {
    variant: {
      primary: 'text-base text-white',
      secondary: 'text-sm tracking-normal text-neutral-400',
    },
  },
});

interface InfoTextProps
  extends React.HTMLProps<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  children: string;
}

export default function InfoText({
  children,
  variant,
  className,
}: InfoTextProps) {
  const [isOverflow, setIsOverflow] = useState<boolean>(false);
  const [contWidth, setContWidth] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref?.current;

    if (!element) return;

    const observer = new ResizeObserver(() => {
      setContWidth(element.clientWidth);
      setIsOverflow(element.scrollWidth > element.clientWidth);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [children]);

  return (
    <p ref={ref} className={cn(textVariants({ variant, className }))}>
      {children}
    </p>
  );
}
