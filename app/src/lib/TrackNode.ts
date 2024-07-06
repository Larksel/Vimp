import usePlayerStore from "@/stores/usePlayerStore";
import { RepeatMode } from "../../shared/types/vimp";

interface TrackNodeType {
  src: AudioBufferSourceNode;
  gainNode: GainNode;
}

interface AudioOptions {
  buffer: AudioBuffer | null;
  detune?: number;
  playbackRate?: number;
}

class TrackNode {
  public src: AudioBufferSourceNode;
  public gainNode: GainNode;

  constructor(nodes: TrackNodeType) {
    this.src = nodes.src;
    this.gainNode = nodes.gainNode;

    this.src.connect(this.gainNode);
    this.gainNode.gain.value = 1;
  }

  connect(node: AudioNode) {
    this.gainNode.connect(node);
  }

  disconnect() {
    this.gainNode.disconnect();
  }

  start(
    when?: number | undefined,
    offset?: number | undefined,
    duration?: number | undefined,
  ) {
    this.src.start(when, offset, duration);
  }

  stop(when?: number | undefined) {
    this.src.stop(when);
  }

  loadAudio(options: AudioOptions) {
    const { repeat } = usePlayerStore.getState();

    this.src.buffer = options.buffer;
    this.src.detune.value = options.detune !== undefined ? options.detune : 0;
    this.src.loop = repeat === RepeatMode.ONE ? true : false;
    this.src.playbackRate.value = 
      options.playbackRate !== undefined ? options.playbackRate : 1;
  }

  toggleRepeat(repeat?: RepeatMode) {
    if (repeat === RepeatMode.ONE) {
      this.src.loop = true;
    } else {
      this.src.loop = false;
    }
  }
}

export default TrackNode;
