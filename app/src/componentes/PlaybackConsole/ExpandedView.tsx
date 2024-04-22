import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentTrack } from '../../features/playerSlice';

import placeholder from '../../assets/images/placeholder.png';

interface ExpandedViewProps {
  visible: boolean;
}

export default function ExpandedView({ visible }: ExpandedViewProps) {
  const [cover, setCover] = useState('');
  const track = useSelector(selectCurrentTrack);

  useEffect(() => {
    setCover(track.cover);
  }, [track.cover]);

  return (
    <div
      className={`${visible ? 'top-0 opacity-100' : 'top-full opacity-0'} absolute bottom-[88px] left-0 right-0 transition-all`}
    >
      <img
        src={cover || placeholder}
        className='absolute inset-0 size-full object-cover blur'
      />
      <img
        src={cover || placeholder}
        className={`absolute left-4 size-64 rounded-lg border border-black/30 object-cover shadow-md transition-all ${visible ? 'visible bottom-4' : 'invisible bottom-0'}`}
      />
    </div>
  );
}
