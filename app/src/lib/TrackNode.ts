interface TrackNodeType {
  src: AudioBufferSourceNode;
  gainNode: GainNode;
}

interface AudioOptions {
  buffer: AudioBuffer | null;
  detune?: number;
  loop?: boolean;
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

  loadAudio(options: AudioOptions) {
    this.src.buffer = options.buffer;
    this.src.detune.value = options.detune || 0;
    this.src.loop = options.loop || true;
    this.src.playbackRate.value = options.playbackRate || 1;
  }
}

export default TrackNode;
