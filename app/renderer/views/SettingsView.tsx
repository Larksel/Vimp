import { createRendererLogger } from '@renderer/utils/logger';
import { Button } from '@renderer/components/common/button';
import { Input } from '@renderer/components/common/input';
import { Switch } from '@renderer/components/common/switch';
import { LoaderData } from '@renderer/routes/router';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Config } from '@shared/types/vimp';

import * as Settings from '@renderer/components/Settings';
import { TrackPersistenceService } from '@renderer/features/data';

const logger = createRendererLogger('SettingsView');

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

    logger.debug('Triggered library scan and save');
    const importedFiles = await window.VimpAPI.library.scanAndSave();
    console.log(importedFiles);

    setScanning(() => false);
  };

  const clearTracksDB = async () => {
    await TrackPersistenceService.clear();
    logger.info('TracksDB limpo');
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
            {!scanning && <Button onClick={rescanTracks}>Rescan Now</Button>}
            {scanning && <Button>Rescanning...</Button>}
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
            className='bg-success max-w-40 self-center transition-colors'
          >
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}

type SettingsLoaderData = LoaderData<typeof loader>

export async function loader() {
  logger.debug('Loading configs');
  const config = await window.VimpAPI.config.getAll();

  return { config };
}
