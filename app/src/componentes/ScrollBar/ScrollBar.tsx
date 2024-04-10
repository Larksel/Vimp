import * as ScrollArea from '@radix-ui/react-scroll-area';

export default function ScrollBar({ children }) {
  return (
    <ScrollArea.Root className='h-full w-full overflow-clip'>
      <ScrollArea.Viewport className='relative w-full h-full'>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className='w-2 h-full'
        orientation='vertical'
      >
        <ScrollArea.Thumb className='w-2 bg-neutral-200 opacity-30' />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar 
        className='w-full h-2'
        orientation='horizontal'
      >
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}