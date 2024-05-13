import { RepeatMode, TrackModel } from '../../shared/types/vimp';
import player from './player';

interface QueueOptions {
  repeat: RepeatMode;
  shuffle: boolean;
}

//TODO usar estado global
class Queue {
  private queue: TrackModel[];
  private originalQueue: TrackModel[];
  private queuePosition: number | null;
  private repeat: RepeatMode;
  private shuffle: boolean;

  constructor(options?: QueueOptions) {
    const defaultState = {
      repeat: RepeatMode.OFF,
      shuffle: false,
      ...options,
    };

    this.queue = [];
    this.originalQueue = [];
    this.queuePosition = null;
    this.repeat = defaultState.repeat;
    this.shuffle = defaultState.shuffle;
  }

  async start(_id?: number) {
    if (this.queue.length === 0) return;

    const trackID = _id || this.queue[0]._id;
    this.queuePosition = this.queue.findIndex(track => track._id === trackID)

    if (this.queuePosition > -1) {
      const track = this.queue[this.queuePosition];

      player.setTrack(track);
      await player.play();

      //TODO estado global
    } else {
      player.stop();
      this.clear();
    }

  }

  async add(track: TrackModel) {
    this.queue.push(track)
  }

  remove(index: number) {
    if (index >= 0 && index < this.queue.length) {
      this.queue.splice(index, 1);
    }
  }

  clear() {
    this.queue = [];
    this.queuePosition = null;
  }

  async next() {
    let track: TrackModel | null;
    console.log('Next Track');

    if (this.queuePosition !== null) {
      if (this.repeat === RepeatMode.ONE) {
        console.log('repeat one')
        track = this.queue[this.queuePosition];
      } else {
        console.log('to the next')
        track = this.getNextTrack();
      }

      if (track) {
        console.log('track', track);
        
        player.setTrack(track);
        await player.play();

        //TODO atualizar queuePosition no estado global
      } else {
        player.stop();
        this.clear();
      }
    }
  }

  async previous() {
    const currentTime = player.getCurrentTime();

    if (this.queuePosition !== null) {
      if (currentTime < 5) {
        this.queuePosition -= 1;
      }

      const newTrack = this.queue[this.queuePosition];

      if (newTrack) {
        player.setTrack(newTrack);
        await player.play();

        //TODO atualizar queuePosition no estado global
      } else {
        player.stop();
        this.clear();
      }
    }
  }

  //TODO toggleShufle
  //TODO toggleRepeat

  /**
   * Get queue info
   */
  getNextTrack(): TrackModel | null {
    if (this.queuePosition !== null) {
      if (
        this.repeat === RepeatMode.ALL &&
        this.queuePosition === this.queue.length - 1
      ) {
        this.queuePosition = 0;
      } else {
        this.queuePosition += 1; //! pode quebrar
      }

      return this.queue[this.queuePosition];
    } else {
      return null;
    }
  }

  getPrevTrack(): TrackModel | null {
    if (this.queuePosition !== null) {
      if (this.queuePosition > 0) {
        return this.queue[this.queuePosition - 1];
      } else if (this.queuePosition === 0 && this.repeat === RepeatMode.ALL) {
        return this.queue[this.queue.length - 1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

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
