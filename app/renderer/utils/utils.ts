import { RouteDefinition } from '@renderer/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format seconds to a readable string
 */
export const formatDuration = (value?: number) => {
  if (value && value !== 0) {
    const hours = Math.trunc(value / 3600);
    const minutes = Math.trunc((value % 3600) / 60);
    const seconds = Math.trunc(value % 60);

    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  }

  return '00:00';
};

/**
 * Clamps a number within the optional minimum and maximum bounds.
 *
 * Returns:
 * - the minimum (`min`) if `value` is less than `min`;
 * - the maximum (`max`) if `value` is greater than `max`;
 * - the original `value` if it lies within the range or if no bounds are provided.
 */
export const betweenMinMax = (
  value: number,
  min?: number,
  max?: number,
): number => {
  if (min !== undefined && value < min) {
    return min;
  } else if (max !== undefined && value > max) {
    return max;
  }

  return value;
};

/**
 * Creates and validates a routes object.
 * - This utility function ensures that all route values conform to the `RouteDefinition` type,
 * while automatically inferring the literal string keys of the created object. This provides
 * full IntelliSense for route keys and their properties.
 */
export function createRoutes<T extends Record<string, RouteDefinition>>(
  routes: T,
): T {
  return routes;
}
