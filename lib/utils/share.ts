/**
 * Simple share utilities - copy to clipboard or native text share
 */

export interface ShareData {
  figureName: string;
  quoteText: string;
  sourceCitation: string;
}

/**
 * Format quote for sharing
 */
export function formatShareText(data: ShareData): string {
  return `"${data.quoteText}"\n\n— ${data.figureName}, ${data.sourceCitation}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Share using native share API or fallback to clipboard
 */
export async function shareQuote(
  data: ShareData
): Promise<{ method: 'share' | 'clipboard'; success: boolean }> {
  const text = formatShareText(data);

  // Check if Web Share API is available (usually mobile)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        text,
      });
      return { method: 'share', success: true };
    } catch (err) {
      // User cancelled or share failed
      if ((err as Error).name === 'AbortError') {
        return { method: 'share', success: false };
      }
      // Fall through to clipboard
    }
  }

  // Fallback to clipboard
  const success = await copyToClipboard(text);
  return { method: 'clipboard', success };
}
