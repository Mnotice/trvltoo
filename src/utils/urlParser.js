// Client-side URL parsing — fast path before hitting the API.
// Handles long-form Google Maps URLs without a network round-trip.

export function detectSource(url) {
  if (/google\.(com|co\.\w+)\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(url)) return 'google-maps';
  if (/instagram\.com/i.test(url)) return 'instagram';
  if (/tiktok\.com/i.test(url)) return 'tiktok';
  return 'other';
}

export const SOURCE_LABELS = {
  'google-maps': { label: 'Google Maps', emoji: '🗺️', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  'instagram':   { label: 'Instagram',   emoji: '📸', color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20' },
  'tiktok':      { label: 'TikTok',      emoji: '🎵', color: 'text-sky-400',     bg: 'bg-sky-500/10 border-sky-500/20' },
  'other':       { label: 'Web Link',    emoji: '🔗', color: 'text-white/50',    bg: 'bg-white/5 border-white/10' },
};

// Attempts to extract structured data from a Google Maps long-form URL.
// Returns null for short URLs (goo.gl/maps.app.goo.gl) — those need the API route.
export function parseGoogleMapsUrl(url) {
  try {
    const u = new URL(url);

    // /maps/place/NAME/@LAT,LNG,ZOOMz  or  /maps/search/NAME/@LAT,LNG
    const pathMatch = u.pathname.match(/\/maps\/(?:place|search)\/([^/@]+)\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (pathMatch) {
      const name = decodeURIComponent(pathMatch[1].replace(/\+/g, ' '));
      return {
        name,
        address: '',
        coordinates: { lat: parseFloat(pathMatch[2]), lng: parseFloat(pathMatch[3]) },
        imageUrl: '',
        notes: '',
      };
    }

    // ?q=LAT,LNG  or  ?q=NAME
    const q = u.searchParams.get('q') || u.searchParams.get('query');
    if (q) {
      const coordMatch = q.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      if (coordMatch) {
        return { name: '', address: q, coordinates: { lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) }, imageUrl: '', notes: '' };
      }
      return { name: q, address: '', coordinates: null, imageUrl: '', notes: '' };
    }

    // ?ll=LAT,LNG with separate name
    const ll = u.searchParams.get('ll');
    if (ll) {
      const [lat, lng] = ll.split(',').map(Number);
      const name = u.searchParams.get('q') || '';
      return { name, address: '', coordinates: { lat, lng }, imageUrl: '', notes: '' };
    }
  } catch {}
  return null;
}

// Best-effort hostname-based name extraction as last resort
export function hostnameToName(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host.split('.')[0].replace(/-/g, ' ');
  } catch {
    return '';
  }
}
