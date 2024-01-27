import { RepeatMode, Track } from '../../shared/types/vimp';
import player from './player';

interface QueueOptions {
  queue: [];
  originalQueue: [];
  queuePosition: number;
  repeat: RepeatMode;
  shuffle: boolean;
}

//TODO usar ids para identificar cada arquivo
//? a queue deve saber de todas as informações do track ou somente o caminho?
class Queue {
  private queue: Track[];
  private originalQueue: Track[];
  private queuePosition: number;
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
    this.queuePosition = 0;
    this.repeat = defaultState.repeat;
    this.shuffle = defaultState.shuffle;
  }

  add(track: Track) {
    this.queue.push(track)
  }

  remove(index: number) {
    if (index >= 0 && index < this.queue.length) {
      this.queue.splice(index, 1);
    }
  }

  play() {
    const currentSong = this.queue[this.queuePosition];
    if (currentSong) {
      player.setTrack(currentSong.path);
      player.play();
    }
  }
  
  //TODO player ou queue?
  next() {
    let nextTrack = null
    if (!(this.queuePosition == this.queue.length - 1)) {
      nextTrack = this.queuePosition + 1;
    } else {
      nextTrack = 0;
    }
  
    this.queuePosition = nextTrack;
  
    player.setTrack(this.queue[nextTrack].path);
    player.play();
  };
  
  //TODO player ou queue?
  previous() {
    let prevTrack = null
    if (!(this.queuePosition == 0)) {
      prevTrack = this.queuePosition - 1;
    } else {
      prevTrack = this.queue.length - 1;
    }
  
    this.queuePosition = prevTrack;
  
    player.setTrack(this.queue[prevTrack].path);
    player.play();
  };

  /**
   * Get queue info
   */
  //TODO getNextTrack
  //TODO getPreviousTrack
  getQueue() {
    return this.queue;
  }

  getQueuePosition() {
    return this.queuePosition;
  }

  getQueueLength() {
    return this.queue.length;
  }

  getRepeat() {
    return this.repeat;
  }

  getShuffle() {
    return this.shuffle;
  }
}

//TODO inicializar queue a partir do estado salvo
export default new Queue();