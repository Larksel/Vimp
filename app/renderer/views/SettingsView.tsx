import { Button } from '@components/common/button';
import { Input } from '@components/common/input';
import { Switch } from '@components/common/switch';
import { LoaderData } from '@renderer/router';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Config } from '@shared/types/vimp';

import * as Settings from '@components/Settings';

export default function SettingsView() {
  const { config } = useLoaderData() as SettingsLoaderData;
  const [configData, setConfigData] = useState<Config>(config);
  const [changed, setChanged] = useState(false);
  const [scanning, setScanning] = useState(false);

  const saveChanges = async () => {
    setChanged(false);

    if (configData === config) return;

    for (const key in configData) {
      await window.VimpAPI.config.set(key as keyof Config, configData[key]);
    }
  };

  const rescanTracks = async () => {
    setScanning(() => true);
    
    const importedFiles = await window.VimpAPI.library.scanAndSave();
    console.log(importedFiles);

    setScanning(() => false);
  };

  const clearTracksDB = async () => {
    await window.VimpAPI.tracksDB.clear();
    console.log('TracksDB limpo');
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex h-full w-[90%] max-w-[800px] flex-col'>
        <Settings.Section name='Geral'>
          <Settings.Option name='Display Notifications (Coming soon)'>
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
          </Settings.Option>
          <Settings.Option name='Rescan Tracks'>
            {!scanning && (
              <Button className='bg-neutral-800' onClick={rescanTracks}>
                Rescan Now
              </Button>
            )}
            {scanning && (
              <Button className='bg-neutral-800'>Rescanning...</Button>
            )}
          </Settings.Option>
        </Settings.Section>
        <Settings.Section name='Pastas de música'>
          <ul className='px-4'>
            {configData.musicFolders.map((folder) => (
              <li key={folder}>- {folder}</li>
            ))}
          </ul>
        </Settings.Section>
        <Settings.Section name='Audio' className='flex flex-col gap-4'>
          <Settings.Option name='Gapless Playback (Coming soon)'>
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
          </Settings.Option>

          <Settings.Option name='Crossfade Duration (Coming soon)'>
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
          </Settings.Option>
        </Settings.Section>
        <Settings.Section name='Danger Zone'>
          <Settings.Option name='Clear Tracks Database'>
            <Button variant={'destructive'} onClick={clearTracksDB}>
              Clear Now
            </Button>
          </Settings.Option>
        </Settings.Section>
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
