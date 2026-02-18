import { PlayerService } from '@renderer/features/player';

export function getRMS(
  data: Uint8Array,
  normalizationFunc?: (value: number) => number,
): number {
  if (data.length === 0) return 0;

  let sumSquares = 0;
  for (const value of data) {
    const normalized = normalizationFunc ? normalizationFunc(value) : value;
    sumSquares += normalized ** 2;
  }

  const squareRoot = Math.sqrt(sumSquares / data.length);
  return Math.min(squareRoot, 1);
}

export function getFrequencyEndIndex(frequency: number) {
  const sampleRate = PlayerService.getSampleRate();
  const fftSize = PlayerService.getAnalyzerFftSize();
  const hzPerBin = sampleRate / fftSize;

  return Math.floor(frequency / hzPerBin);
}

/**
 * Gera pontos adicionais e suaviza as curvas
 */
export function getInterpolatedValue(
  data: Uint8Array,
  targetIndex: number,
): number {
  // Índice base inteiro e posição fracionária entre bins
  const baseIndex = Math.floor(targetIndex);
  const fraction = targetIndex - baseIndex;

  // Índices dos pontos de controle
  const previousIndex = Math.max(baseIndex - 1, 0);
  const currentIndex = baseIndex;
  const nextIndex = Math.min(baseIndex + 1, data.length - 1);
  const nextNextIndex = Math.min(baseIndex + 2, data.length - 1);

  // Valores dos pontos de controle
  const previousValue = data[previousIndex] ?? 0;
  const currentValue = data[currentIndex] ?? 0;
  const nextValue = data[nextIndex] ?? 0;
  const nextNextValue = data[nextNextIndex] ?? 0;

  // Potências da fração (otimiza leitura da fórmula)
  const fractionSquared = fraction * fraction;
  const fractionCubed = fractionSquared * fraction;

  // Interpolação spline cúbica (Catmull-Rom)
  return (
    0.5 *
    (2 * currentValue +
      (nextValue - previousValue) * fraction +
      (2 * previousValue - 5 * currentValue + 4 * nextValue - nextNextValue) *
        fractionSquared +
      (-previousValue + 3 * currentValue - 3 * nextValue + nextNextValue) *
        fractionCubed)
  );
}

/**
 * Suaviza o ataque e a liberação das batidas dos graves, médios e agudos
 */
export function followEnvelope(
  current: number,
  target: number,
  attack = 0.7,
  release = 0.25,
) {
  const coeff = target > current ? attack : release;
  return current + (target - current) * coeff;
}
