import placeholder from '@assets/images/placeholder.png';
import useCurrentTrack from '@hooks/useCurrentTrack';

interface ExpandedViewProps {
  visible: boolean;
}

// TODO pagina separada

export default function ExpandedView({ visible }: ExpandedViewProps) {
  const track = useCurrentTrack();

  return (
    <div
      className={`${visible ? 'top-0 opacity-100' : 'top-full opacity-0'} absolute bottom-[88px] left-0 right-0 bg-black transition-all`}
    >
      <img
        src={track.cover || placeholder}
        alt=''
        className='absolute inset-0 size-full object-cover opacity-30 blur'
      />
      <img
        src={track.cover || placeholder}
        alt=''
        className={`absolute left-4 size-64 rounded-lg border border-black/30 object-cover shadow-md transition-all ${visible ? 'visible bottom-4' : 'invisible bottom-0'}`}
      />
    </div>
  );
}
