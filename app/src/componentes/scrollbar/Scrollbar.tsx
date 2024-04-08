import * as ScrollArea from '@radix-ui/react-scroll-area';

export default function Scrollbar({ children }) {
  return (
    <ScrollArea.Root className='h-full w-full overflow-hidden'>
      <ScrollArea.Viewport className='relative h-full rounded-lg bg-neutral-900'>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation='vertical'>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}