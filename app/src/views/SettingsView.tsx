import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Switch } from '@/componentes/ui/switch';
import { LoaderData } from '@/router';
import { useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { Config } from '../../shared/types/vimp';

import * as Setting from '@/componentes/Setting/Setting';

export default function SettingsView() {
  const { config } = useLoaderData() as SettingsLoaderData;
  const [configData, setConfigData] = useState<Config>(config);
  const [changed, setChanged] = useState(false);
  const [scanning, setScanning] = useState(false);
  const revalidator = useRevalidator();

  const saveChanges = async () => {
    setChanged(false);

    if (configData === config) return;

    for (const key in configData) {
      await window.VimpAPI.config.set(key as keyof Config, configData[key]);
    }
  };

  const rescanTracks = async () => {
    setScanning(() => true);
    const pathsToScan = await window.VimpAPI.config.get('musicFolders');
    const trackPaths = await window.VimpAPI.library.scanTracks(pathsToScan);

    const tracksDB = await window.VimpAPI.library.importTracks(trackPaths);
    console.log(tracksDB);

    revalidator.revalidate();
    setScanning(() => false);
  };

  const clearTracksDB = async () => {
    await window.VimpAPI.db.clearTracks();
    console.log('TracksDB limpo');
    revalidator.revalidate();
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex h-full w-full max-w-[800px] flex-col'>
        <Setting.Section name='Geral'>
          <Setting.Option name='Display Notifications (Coming soon)'>
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
          </Setting.Option>
          <Setting.Option name='Rescan Tracks'>
            {!scanning && (
              <Button className='bg-neutral-800' onClick={rescanTracks}>
                Rescan Now
              </Button>
            )}
            {scanning && (
              <Button className='bg-neutral-800'>Rescanning...</Button>
            )}
          </Setting.Option>
        </Setting.Section>
        <Setting.Section name='Pastas de música'>
          <ul className='px-4'>
            {configData.musicFolders.map((folder) => (
              <li key={folder}>- {folder}</li>
            ))}
          </ul>
        </Setting.Section>
        <Setting.Section name='Audio' className='flex flex-col gap-4'>
          <Setting.Option name='Gapless Playback (Coming soon)'>
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
          </Setting.Option>

          <Setting.Option name='Crossfade Duration (Coming soon)'>
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
          </Setting.Option>
        </Setting.Section>
        <Setting.Section name='Danger Zone'>
          <Setting.Option name='Clear Tracks Database'>
            <Button variant={'destructive'} onClick={clearTracksDB}>
              Clear Now
            </Button>
          </Setting.Option>
        </Setting.Section>
        {changed && (
          <Button
            onClick={saveChanges}
            className='max-w-40 self-center bg-green-600 transition-colors hover:bg-green-500'
          >
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}

export type SettingsLoaderData = LoaderData<typeof SettingsView.loader>;

SettingsView.loader = async () => {
  const config = await window.VimpAPI.config.getAll();

  return { config };
};
