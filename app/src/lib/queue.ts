import { RepeatMode } from '../types/vimp';
import player from './player';

interface QueueOptions {
  queue: [];
  originalQueue: [];
  queuePosition: number | null;
  repeat: RepeatMode;
  shuffle: boolean;
}

class Queue {
  private queue: [];
  private originalQueue: [];
  private queuePosition: number | null;
  private repeat: string;
  private shuffle: boolean;

  constructor(options?: QueueOptions) {
    const defaultState = {
      repeat: 'off',
      shuffle: false,
      ...options
    }

    this.queue = [];
    this.originalQueue = [];
    this.queuePosition = null;
    this.repeat = defaultState.repeat;
    this.shuffle = defaultState.shuffle;
  }
  
  //TODO player ou queue?
  next() {
    /*
    let nextTrack = 0
    if (!(this.queuePosition == tracks.length - 1)) {
      nextTrack = this.queuePosition + 1;
    } else {
      nextTrack = 0;
    }
  
    this.queuePosition = nextTrack;
  
    player.setTrack(tracks[nextTrack]);
    player.play();
    */
  };
  
  //TODO player ou queue?
  previous() {
    /*
    let prevTrack = 0
    if (!(this.queuePosition == 0)) {
      prevTrack = this.queuePosition - 1;
    } else {
      prevTrack = tracks.length - 1;
    }
  
    this.queuePosition = prevTrack;
  
    player.setTrack(tracks[prevTrack]);
    player.play();
    */
  };

  /**
   * Get queue info
   */
  //TODO getNextTrack
  //TODO getPreviousTrack
  getQueuePosition() {
    return this.queuePosition;
  }

  getQueueLength() {
    return this.queue.length
  }
}

//TODO inicializar queue a partir do estado salvo
export default new Queue();