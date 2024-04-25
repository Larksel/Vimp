import { useRef, useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('w-fit', {
  variants: {
    variant: {
      primary: 'text-base text-white',
      secondary: 'text-sm tracking-normal text-zinc-400',
    },
  },
});

interface InfoTextProps
  extends React.HTMLProps<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  text: string | string[];
}

//TODO componente possivelmente de nivel alto (usado em outros lugares)
export default function InfoText({ text, variant, className }: InfoTextProps) {
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
  }, [text]);

  return (
    <p ref={ref} className={cn(textVariants({ variant, className}))}>
      {text}
    </p>
  );
}
