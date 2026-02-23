import { createRendererLogger } from '@renderer/utils/logger';
import { PlayerConfig, RepeatMode } from '@shared/types/vimp';
import debounce from 'lodash/debounce';

const logger = createRendererLogger('PlayerConfig');
const { config } = window.VimpAPI;

const updatePersistentConfig = async (
  configFragment: Partial<PlayerConfig>,
) => {
  try {
    const playerConfig = await config.get('player');
    await config.set('player', { ...playerConfig, ...configFragment });
    logger.debug(`Player config updated: ${JSON.stringify(configFragment)}`);
  } catch (error) {
    logger.error(`Failed to update player config: ${error}`);
  }
};

export const playerConfigService = {
  setAudioShuffle: debounce(
    (shuffle: boolean) => updatePersistentConfig({ audioShuffle: shuffle }),
    500,
  ),
  setAudioRepeatMode: debounce(
    (mode: RepeatMode) => updatePersistentConfig({ audioRepeatMode: mode }),
    500,
  ),
  setAudioMuted: debounce(
    (muted: boolean) => updatePersistentConfig({ audioMuted: muted }),
    500,
  ),
  setGaplessPlayback: debounce(
    (enabled: boolean) =>
      updatePersistentConfig({ audioGaplessPlayback: enabled }),
    500,
  ),
  setCrossfadeDuration: debounce(
    (duration: number) =>
      updatePersistentConfig({ audioCrossfadeDuration: duration }),
    500,
  ),
  setPlaybackRate: debounce(
    (rate: number) => updatePersistentConfig({ audioPlaybackRate: rate }),
    500,
  ),
  setVolume: debounce(
    (volume: number) => updatePersistentConfig({ audioVolume: volume }),
    500,
  ),
};
