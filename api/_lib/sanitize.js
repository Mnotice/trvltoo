/**
 * Strips control characters and enforces a max length.
 * Used to scrub free-text before inserting into LLM prompts.
 */
export function sanitizeString(val, maxLen = 200) {
  if (typeof val !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return val.replace(/[\x00-\x1F\x7F]/g, '').slice(0, maxLen);
}
