import { createRendererLogger } from '@renderer/utils/logger';
import { Button } from '@renderer/components/common/button';
import { Input } from '@renderer/components/common/input';
import { Switch } from '@renderer/components/common/switch';
import { useState } from 'react';

import * as Settings from '../components';
import { TrackPersistenceService } from '@renderer/features/data';
import useConfigStore, { useConfigAPI } from '@renderer/stores/useConfigStore';
import { useLibraryAPI } from '@renderer/stores/useLibraryStore';

const logger = createRendererLogger('SettingsView');

export default function SettingsView() {
  const config = useConfigStore((state) => state);
  const configAPI = useConfigAPI();
  const libraryAPI = useLibraryAPI();
  const [scanning, setScanning] = useState(false);

  const rescanTracks = async () => {
    setScanning(() => true);

    logger.debug('Triggered library scan and save');
    libraryAPI.scanFolders();

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
              checked={config.displayNotifications}
              onCheckedChange={() => {
                configAPI.setDisplayNotifications(!config.displayNotifications);
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
            {config.musicFolders.map((folder) => (
              <li key={folder}>- {folder}</li>
            ))}
          </ul>
        </Settings.Section>
        <Settings.Section name='Audio' className='flex flex-col gap-4'>
          <Settings.Option name='Gapless Playback (Coming soon)'>
            <Switch
              checked={config.player.audioGaplessPlayback}
              onCheckedChange={() => {
                configAPI.setGaplessPlayback(
                  !config.player.audioGaplessPlayback,
                );
              }}
            />
          </Settings.Option>

          <Settings.Option name='Crossfade Duration (Coming soon)'>
            <Input
              className='max-w-16'
              value={config.player.audioCrossfadeDuration}
              onChange={(e) => {
                configAPI.setCrossfadeDuration(Number(e.target.value));
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
      </div>
    </div>
  );
}
