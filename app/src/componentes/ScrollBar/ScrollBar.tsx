import * as ScrollArea from '@radix-ui/react-scroll-area';

export default function ScrollBar({ children }) {
  return (
    <ScrollArea.Root className='h-full w-full'>
      <ScrollArea.Viewport className='h-full *:h-full'>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className='h-full w-1' orientation='vertical'>
        <ScrollArea.Thumb className='w-1 bg-neutral-200 opacity-30' />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
