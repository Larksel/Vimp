import { useRef, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface InfoTextProps {
  variant: 'body1' | 'caption';
  color?: string;
  text: string | string[];
}

export default function InfoText({ variant, color, text }: InfoTextProps) {
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
    <Box ref={ref}>
      <Typography
        variant={variant}
        color={color}
        sx={{
          width: 'fit-content',
          '@keyframes slide': {
            '0%, 14%': { transform: 'translateX(0)' },
            '86%, 100%': {
              transform: `translateX(calc(-100% + (${contWidth}px)))`,
            },
          },
          animation: isOverflow ? 'slide 14s linear infinite alternate' : '',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
