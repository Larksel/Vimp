import log from 'electron-log/renderer';
import { Button } from '@components/common/button';

interface EmptyLibraryProps {
  viewName: string;
}

export default function EmptyLibrary(props: EmptyLibraryProps) {
  const { viewName } = props;
  const forceScan = async () => {
    log.debug(`[${viewName}] Triggered library scan and save`);
    const importedFiles = await window.VimpAPI.library.scanAndSave();
    console.log(importedFiles);
  };

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='text-text-secondary flex h-80 flex-col items-center justify-center space-y-4'>
        <h3 className='text-text-primary text-lg font-semibold'>
          Sua biblioteca está vazia
        </h3>
        <hr className='text-text-sub mb-4' />
        <Button variant={'outline'} onClick={forceScan}>
          Procurar arquivos
        </Button>
      </div>
    </div>
  );
}
