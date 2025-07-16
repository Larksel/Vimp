import { useLocation, useNavigate } from 'react-router-dom';
import { CaretLeftIcon } from '@phosphor-icons/react/dist/csr/CaretLeft';
import { CaretRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight';
import { BellIcon } from '@phosphor-icons/react/dist/csr/Bell';
import { GearIcon } from '@phosphor-icons/react/dist/csr/Gear';
import { Button } from '@components/common/button';

import routes from '@renderer/routes';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='absolute z-10 flex h-16 w-full items-center justify-between gap-2 px-4'>
      <div className='flex h-full flex-row items-center gap-2'>
        <Button
          variant='glass'
          onClick={() => navigate(-1)}
          className='aspect-square rounded-full p-0'
        >
          <CaretLeftIcon size={20} />
        </Button>
        <Button
          variant='glass'
          onClick={() => navigate(1)}
          className='aspect-square rounded-full p-0'
        >
          <CaretRightIcon size={20} />
        </Button>
      </div>

      <div className='flex flex-row gap-2'>
        <Button variant='glass' className='aspect-square rounded-full p-0'>
          <BellIcon size={20} />
        </Button>
        <Button
          variant='glass'
          onClick={() => {
            if (location.pathname.replace('/', '') !== routes.SETTINGS)
              navigate(routes.SETTINGS);
          }}
          className='aspect-square rounded-full p-0'
        >
          <GearIcon size={20} />
        </Button>
      </div>
    </div>
  );
}
