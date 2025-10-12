import { createRendererLogger } from '@renderer/utils/logger';
import { Button } from '@renderer/components/common';
import { useState } from 'react';
import { useLibraryAPI } from '@renderer/stores/useLibraryStore';

interface EmptyLibraryProps {
  viewName: string;
}

export default function EmptyLibrary(props: EmptyLibraryProps) {
  const { viewName } = props;
  const [scanning, setScanning] = useState(false);
  const libraryAPI = useLibraryAPI();
  const logger = createRendererLogger(viewName);

  const forceScan = async () => {
    setScanning(() => true);

    logger.debug(`Triggered library scan and save`);
    libraryAPI.scanFolders();

    setScanning(() => false);
  };

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='text-text-secondary flex h-80 flex-col items-center justify-center space-y-4'>
        <h3 className='text-text-primary text-lg font-semibold'>
          Sua biblioteca está vazia
        </h3>
        <hr className='text-text-sub mb-4' />
        {!scanning && (
          <Button variant={'outline'} onClick={forceScan}>
            Procurar arquivos
          </Button>
        )}
        {scanning && (
          <Button variant={'outline'} disabled>
            Rescanning...
          </Button>
        )}
      </div>
    </div>
  );
}
