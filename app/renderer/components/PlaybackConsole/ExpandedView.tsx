import placeholder from '@renderer/assets/images/placeholder.png';
import AudioVisualizer from '@renderer/components/AudioVisualizer';
import useCurrentTrack from '@renderer/hooks/useCurrentTrack';

interface ExpandedViewProps {
  visible: boolean;
}

export default function ExpandedView(props: ExpandedViewProps) {
  const { visible } = props;
  const track = useCurrentTrack();

  return (
    <div
      className={`${visible ? 'top-0 opacity-100' : 'invisible top-full opacity-0'} bg-background absolute right-0 bottom-[80px] left-0 flex items-center justify-center p-4 pl-72 transition-all`}
    >
      {visible && (
        <div className='z-10 h-64 w-full self-end'>
          <AudioVisualizer />
        </div>
      )}
      <img
        src={track?.cover ?? placeholder}
        alt=''
        className='absolute inset-0 size-full object-cover blur-md brightness-30'
      />
      <img
        src={track?.cover ?? placeholder}
        alt=''
        className={`absolute left-4 size-64 rounded-lg object-cover shadow-md transition-all ${visible ? 'visible bottom-4' : 'invisible bottom-0'}`}
      />
    </div>
  );
}
