import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Switch } from '@/componentes/ui/switch';
import { LoaderData } from '@/router';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Config } from '../../../shared/types/vimp';

export default function Settings() {
  const { config } = useLoaderData() as SettingsLoaderData;
  const [configData, setConfigData] = useState<Config>(config);
  const [changed, setChanged] = useState(false);

  const saveChanges = async () => {
    setChanged(false);

    if (configData === config) return;

    for (const key in configData) {
      await window.VimpAPI.config.set(key as keyof Config, configData[key])
    }
  };

  return (
    <div className='flex flex-col space-y-4 px-14'>
      <h1 className='text-2xl font-bold'>Settings</h1>
      <div>
        <h3 className='text-lg font-bold'>Geral</h3>
        <div className='flex items-center justify-between'>
          <h6>Display Notifications</h6>
          <Switch
            checked={configData.displayNotifications}
            onCheckedChange={() => {
              setConfigData({
                ...configData,
                displayNotifications: !configData.displayNotifications,
              });
              setChanged(true);
            }}
          />
        </div>
      </div>
      <div>
        <h3 className='text-lg font-bold'>Pastas de música</h3>
        <ul className='px-4'>
          {configData.musicFolders.map((folder) => (
            <li key={folder}>- {folder}</li>
          ))}
        </ul>
      </div>
      <div className='flex flex-col gap-4'>
        <h3 className='text-lg font-bold'>Audio</h3>

        <div className='flex items-center justify-between'>
          <h6>Gapless Playback</h6>
          <Switch
            checked={configData.audioGaplessPlayback}
            onCheckedChange={() => {
              setConfigData({
                ...configData,
                audioGaplessPlayback: !configData.audioGaplessPlayback,
              });
              setChanged(true);
            }}
          />
        </div>

        <div className='flex items-center justify-between'>
          <h6 className='whitespace-nowrap'>Crossfade Duration</h6>
          <Input
            className='max-w-16'
            value={configData.audioCrossfadeDuration}
            onChange={(e) => {
              setConfigData({
                ...configData,
                audioCrossfadeDuration: Number(e.target.value),
              });
              setChanged(true);
            }}
          />
        </div>
      </div>
      {changed && (
        <Button onClick={saveChanges} className='max-w-40 self-center bg-green-600 transition-colors hover:bg-green-500'>
          Save Changes
        </Button>
      )}
    </div>
  );
}

export type SettingsLoaderData = LoaderData<typeof Settings.loader>;

Settings.loader = async () => {
  const config = await window.VimpAPI.config.getAll();

  return { config };
};
