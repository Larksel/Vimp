import { Button } from '@renderer/components/common';
import SearchBox from '@renderer/components/SearchBox';
import { formatDuration } from '@renderer/utils/utils';
import placeholder from '@renderer/assets/images/placeholder.png';
import useCurrentTrack from '@renderer/hooks/useCurrentTrack';

export default function DownloaderView() {
  const track = useCurrentTrack(); // Placeholder temporário

  return (
    <div className='flex flex-col items-center gap-4 px-4 pb-4'>
      <SearchBox
        name='download-link'
        canChangeVisibility={false}
        onSearch={(search) => console.log(search)}
        className='max-w-[50%] rounded-lg'
      />
      <div className='flex h-full w-[40%] flex-col justify-center gap-4 self-start p-4'>
        <div className='relative overflow-clip rounded-lg'>
          <img
            src={track?.cover ?? placeholder}
            alt=''
            className='aspect-video w-full object-cover'
          />
          <p className='bg-glass-base absolute right-0 bottom-0 rounded-tl-sm px-1 text-sm select-none'>
            {formatDuration(track?.duration)}
          </p>
        </div>
        <div className='flex h-full flex-col gap-8'>
          {track ? (
            <>
              <div>
                <h6 className='text-text-primary truncate text-xl font-bold'>
                  {track?.title}
                </h6>
                <p className='text-text-secondary truncate'>{track?.artist}</p>
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
