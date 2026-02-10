/**
 * Fisher-Yates shuffle algorithm
 * Returns a new shuffled array without mutating the original
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates a fake relative timestamp like "2h", "5h", "1d", "3d"
 * Randomly picks from realistic-looking recent times
 */
export function generateFakeTimestamp(): string {
  const options = [
    // Hours (more common)
    '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h',
    '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h',
    // Days (less common)
    '1d', '2d', '3d', '4d', '5d', '6d',
    // Minutes for very recent feel
    '15m', '30m', '45m',
  ];

  // Weight towards hours for more realistic feel
  const weighted = [
    ...options.slice(0, 23), // hours (1x)
    ...options.slice(0, 23), // hours again (2x weight)
    ...options.slice(23, 29), // days (1x)
    ...options.slice(29), // minutes (1x)
  ];

  return weighted[Math.floor(Math.random() * weighted.length)];
}

/**
 * Generates an array of fake timestamps for a list of items
 */
export function generateFakeTimestamps(count: number): string[] {
  return Array.from({ length: count }, () => generateFakeTimestamp());
}
