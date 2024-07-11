class AudioProgressTracker extends AudioWorkletProcessor {
  private position: number;

  constructor() {
    super();
    this.position = 0;
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ) {
    const input = inputs[0];
    const output = outputs[0];

    if (input && output) {
      for (let channel = 0; channel < input.length; channel++) {
        const inputChannel = input[channel];
        const outputChannel = output[channel];

        for (let i = 0; i < inputChannel.length; i++) {
          outputChannel[i] = inputChannel[i];
        }
      }

      this.position += input[0].length / sampleRate;
    }

    this.port.postMessage({ position: this.position });

    return true;
  }
}

registerProcessor('AudioProgressTracker', AudioProgressTracker);
