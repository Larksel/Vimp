/**
 * Format seconds to a readable string
 */
export const formatDuration = (value: number) => {
  if (value && value !== 0) {
    const hours = Math.trunc(value / 3600);
    const minutes = Math.trunc((value % 3600) / 60);
    const seconds = Math.trunc(value % 60);

    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = `${minutes < 10 ? `0${minutes}` : minutes}:`;
    const formattedSeconds = `${seconds < 10 ? `0${seconds}` : seconds}`;

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  }

  return '00:00';
}