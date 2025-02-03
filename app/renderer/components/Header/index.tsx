import { useLocation, useNavigate } from 'react-router-dom';
import { CaretLeft, CaretRight, Bell, Gear } from '@phosphor-icons/react';
import { Button } from '@components/common/button';

import routes from '@renderer/routes';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='absolute z-10 flex h-16 w-full items-center justify-between gap-2 p-4'>
      <div className='flex flex-row gap-2'>
        <Button
          variant='glass'
          onClick={() => navigate(-1)}
          className='aspect-square rounded-full p-0'
        >
          <CaretLeft size={20} />
        </Button>
        <Button
          variant='glass'
          onClick={() => navigate(1)}
          className='aspect-square rounded-full p-0'
        >
          <CaretRight size={20} />
        </Button>
      </div>

      <div className='flex flex-row gap-2'>
        <Button variant='glass' className='aspect-square rounded-full p-0'>
          <Bell size={20} />
        </Button>
        <Button
          variant='glass'
          onClick={() => {
            if (location.pathname.replace('/', '') !== routes.SETTINGS)
              navigate(routes.SETTINGS);
          }}
          className='aspect-square rounded-full p-0'
        >
          <Gear size={20} />
        </Button>
      </div>
    </div>
  );
}
