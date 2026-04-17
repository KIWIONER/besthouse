/**
 * Security utilities — XSS prevention helpers.
 * Import these functions wherever external or user-provided data
 * is interpolated into innerHTML or HTML attribute values.
 */

/**
 * Escapes HTML special characters so they render as text, not markup.
 * Use on ANY string coming from external APIs, databases, or user input
 * before inserting it into innerHTML.
 */
export function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sanitizes a URL to block javascript:, data:, and vbscript: injection.
 * Use for img src, a href, and any URL-type attribute sourced from
 * external data.
 * Returns an empty string if the URL is potentially dangerous.
 */
export function sanitizeURL(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    (lower.startsWith('data:') && !lower.startsWith('data:image/')) ||
    lower.startsWith('vbscript:')
  ) {
    return '';
  }
  return trimmed;
}
