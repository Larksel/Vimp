import { CaretLeftIcon } from '@phosphor-icons/react/dist/csr/CaretLeft';
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight';

import Logo from '../Logo';

import NavButtons from './NavButtons';
import PlaylistList from './PlaylistList';
import { Button } from '@renderer/components/common/button';
import useAudioData from '@renderer/hooks/useAudioData';
import { useEffect, useRef } from 'react';

interface SideBarProps {
  toggle: () => void;
  collapsed: boolean;
}

export default function SideBar(props: SideBarProps) {
  const { toggle, collapsed } = props;
  const logoRef = useRef<SVGSVGElement>(null);
  const audioDataRef = useAudioData();

  useEffect(() => {
    let animationFrameId: number;

    const animationLoop = () => {
      if (logoRef.current && audioDataRef.current) {
        const { rmsLevel } = audioDataRef.current;
        const scale = 1 + rmsLevel * 0.35;

        logoRef.current.style.transform = `scale(${scale})`;
      }
      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioDataRef]);

  return (
    <div className='flex w-(--sidebar-width) flex-col items-center gap-2 overflow-clip rounded-lg transition-all select-none'>
      <div className='bg-surface-base flex h-auto w-full shrink-0 flex-col items-center justify-center overflow-clip rounded-lg'>
        <Button
          onClick={toggle}
          variant={'surface'}
          className='text-md relative flex h-14 w-full items-center justify-center px-2 transition-all'
        >
          <Logo ref={logoRef} className='aspect-square size-8 select-none' />
          <div className='absolute right-0 left-0 flex items-center justify-between'>
            <CaretRightIcon
              weight='bold'
              className={`absolute ${collapsed ? 'left-[-100%] opacity-0' : 'left-4 w-5 opacity-100'} h-5 transition-all`}
            />
            <CaretLeftIcon
              weight='bold'
              className={`absolute ${collapsed ? 'right-[-100%] opacity-0' : 'right-4 w-5 opacity-100'} h-5 transition-all`}
            />
          </div>
        </Button>

        <NavButtons collapsed={collapsed} />
      </div>

      <PlaylistList collapsed={collapsed} />
    </div>
  );
}
