/**
 * Blocks file://, localhost, and RFC-1918 / link-local addresses
 * to prevent SSRF when the server fetches a user-supplied URL.
 */
const PRIVATE_IP_RE = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|::1|fc00:|fd)/;

export function isSafeUrl(raw) {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    // Strip brackets from IPv6 addresses: [::1] → ::1
    const host = u.hostname.toLowerCase().replace(/\.+$/, '').replace(/^\[|\]$/g, '');
    if (host === 'localhost' || PRIVATE_IP_RE.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}
