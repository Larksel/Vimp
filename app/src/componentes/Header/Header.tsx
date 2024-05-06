import { CaretLeft, CaretRight, Bell, Gear } from '@phosphor-icons/react';
import { Button } from '../ui/button';

//TODO cor de fundo sólida após scroll <- Fade in
//TODO implementar métodos de navegação
export default function Header() {
  return (
    <div className='absolute z-10 flex h-16 w-full items-center justify-between gap-2 p-4'>
      <div className='flex flex-row gap-2'>
        <Button
          variant='ghost'
          className='aspect-square rounded-full bg-[#0009] p-0 text-neutral-400 hover:scale-110 hover:bg-[#0009] hover:text-white active:bg-[#fff3]'
        >
          <CaretLeft size={20} />
        </Button>
        <Button
          variant='ghost'
          className='aspect-square rounded-full bg-[#0009] p-0 text-neutral-400 hover:scale-110 hover:bg-[#0009] hover:text-white active:bg-[#fff3]'
        >
          <CaretRight size={20} />
        </Button>
      </div>
      <div className='flex flex-row gap-2'>
        <Button
          variant='ghost'
          className='aspect-square rounded-full bg-[#0009] p-0 text-neutral-400 hover:scale-110 hover:bg-[#0009] hover:text-white active:bg-[#fff3]'
        >
          <Bell size={20} />
        </Button>
        <Button
          variant='ghost'
          className='aspect-square rounded-full bg-[#0009] p-0 text-neutral-400 hover:scale-110 hover:bg-[#0009] hover:text-white active:bg-[#fff3]'
        >
          <Gear size={20} />
        </Button>
      </div>
    </div>
  );
}
