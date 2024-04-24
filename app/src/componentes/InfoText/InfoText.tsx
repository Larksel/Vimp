import { useRef, useEffect, useState } from 'react';

interface InfoTextProps {
  variant: 'primary' | 'secondary';
  text: string | string[];
}

//TODO componente possivelmente de nivel alto (usado em outros lugares)
export default function InfoText({ text, variant }: InfoTextProps) {
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
    <div ref={ref}>
      <p className='w-fit'>
        {text}
      </p>
    </div>
  );
}
