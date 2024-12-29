import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@render-utils/utils';

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

  return (
    <p className={cn(textVariants({ variant, className }))}>
      {children}
    </p>
  );
}
