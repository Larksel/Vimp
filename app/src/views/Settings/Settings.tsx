import { Input } from '@/componentes/ui/input';
import { Switch } from '@/componentes/ui/switch';
import { LoaderData } from '@/router';
import { useLoaderData } from 'react-router-dom';

export default function Settings() {
  const { config } = useLoaderData() as SettingsLoaderData;

  return (
    <div className='flex flex-col space-y-4 px-14'>
      <h1 className='text-2xl font-bold'>Settings</h1>
      <div>
        <h3 className='text-lg font-bold'>Geral</h3>
        <div className='flex items-center justify-between'>
          <h6>Display Notifications</h6>
          <Switch checked={config.displayNotifications} />
        </div>
      </div>
      <div>
        <h3 className='text-lg font-bold'>Pastas de música</h3>
        <ul className='px-4'>
          {config.musicFolders.map((folder) => (
            <li>- {folder}</li>
          ))}
        </ul>
      </div>
      <div className='flex flex-col gap-4'>
        <h3 className='text-lg font-bold'>Audio</h3>
        <div className='flex items-center justify-between'>
          <h6>Gapless Playback</h6>
          <Switch checked={config.displayNotifications} />
        </div>
        <div className='flex items-center justify-between'>
          <h6 className='whitespace-nowrap'>Crossfade Duration</h6>
          <Input className='max-w-16' value={config.audioCrossfadeDuration} />
        </div>
      </div>
    </div>
  );
}

export type SettingsLoaderData = LoaderData<typeof Settings.loader>;

Settings.loader = async () => {
  const config = await window.VimpAPI.config.getAll();

  console.log('Current config:', config);

  return { config };
};
