import { Button } from '@renderer/components/common/button';
import SearchBox from '@renderer/components/SearchBox';
import useCurrentTrack from '@renderer/hooks/useCurrentTrack';
import { formatDuration } from '@renderer/utils/utils';
import placeholder from '@renderer/assets/images/placeholder.png';

export default function DownloaderView() {
  const track = useCurrentTrack(); // Placeholder temporário

  return (
    <div className='flex flex-col gap-4 px-4 pb-4'>
      <SearchBox
        name='download-link'
        canChangeVisibility={false}
        onSearch={(search) => console.log(search)}
        className='rounded-lg'
      />
      <div className='flex h-full w-[50%] flex-col justify-center gap-4'>
        <img
          src={track?.cover ?? placeholder}
          alt=''
          className='aspect-video h-full rounded-lg object-cover'
        />
        <div className='flex h-full flex-col justify-between'>
          {track ? (
            <>
              <div>
                <h6 className='truncate'>{track?.title}</h6>
                <p className='truncate'>{track?.artist}</p>
                <p>Duração: {formatDuration(track?.duration)}</p>
              </div>
              <Button className='bg-accent' variant={'filled'}>
                Download
              </Button>
            </>
          ) : (
            <p className='text-center'>Nenhuma música selecionada</p>
          )}
        </div>
      </div>
    </div>
  );
}
