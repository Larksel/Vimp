import * as ScrollArea from '@radix-ui/react-scroll-area';

export default function ScrollBar({ children }) {
  return (
    <ScrollArea.Root className='h-full w-full'>
      <ScrollArea.Viewport className='relative h-full bg-lime-500'>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation='vertical'>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}