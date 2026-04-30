// Vercel API route — resolves shortened URLs and extracts OG metadata server-side.
// Uses Node 18+ native fetch (no extra dependencies).

import { isSafeUrl } from './_lib/urlSafety.js';

const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.ALLOWED_ORIGIN,
].filter(Boolean));

function getAllowedOrigin(req) {
  const origin = req.headers.origin ?? '';
  return ALLOWED_ORIGINS.has(origin) ? origin : null;
}

export function parseGoogleMapsPath(url) {
  try {
    const u = new URL(url);
    const pathMatch = u.pathname.match(/\/maps\/(?:place|search)\/([^/@]+)\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (pathMatch) {
      return {
        name: decodeURIComponent(pathMatch[1].replace(/\+/g, ' ')),
        address: '',
        coordinates: { lat: parseFloat(pathMatch[2]), lng: parseFloat(pathMatch[3]) },
        imageUrl: '',
        notes: '',
      };
    }
    const q = u.searchParams.get('q');
    if (q) {
      const coords = q.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      if (coords) return { name: '', address: q, coordinates: { lat: parseFloat(coords[1]), lng: parseFloat(coords[2]) }, imageUrl: '', notes: '' };
      return { name: q, address: '', coordinates: null, imageUrl: '', notes: '' };
    }
  } catch { /* invalid URL format — return null */ }
  return null;
}

function getMetaContent(html, property) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']` +
    `|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    'i'
  );
  const m = html.match(re);
  return m ? (m[1] || m[2] || '').trim() : '';
}

export function parseOgFromHtml(html) {
  const name   = getMetaContent(html, 'og:title') || getMetaContent(html, 'twitter:title') || '';
  const image  = getMetaContent(html, 'og:image') || getMetaContent(html, 'twitter:image') || '';
  const desc   = getMetaContent(html, 'og:description') || getMetaContent(html, 'twitter:description') || '';
  const lat    = parseFloat(getMetaContent(html, 'place:location:latitude'))  || null;
  const lng    = parseFloat(getMetaContent(html, 'place:location:longitude')) || null;
  return {
    name:        name.replace(/ on Instagram$| on TikTok$| — Google Maps$/i, '').trim(),
    imageUrl:    image,
    notes:       desc,
    address:     '',
    coordinates: lat && lng ? { lat, lng } : null,
  };
}

export default async function handler(req, res) {
  const allowedOrigin = getAllowedOrigin(req);
  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!allowedOrigin) return res.status(403).json({ error: 'Forbidden' });

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url param is required' });
  if (!isSafeUrl(url)) return res.status(400).json({ error: 'Invalid or disallowed URL' });

  const UA = 'Mozilla/5.0 (compatible; TRVLTOO/1.0; +https://trvltoo.com)';

  // 1. Try direct Google Maps path parsing (no network needed)
  const gmDirect = parseGoogleMapsPath(url);
  if (gmDirect) return res.json({ ...gmDirect, source: 'google-maps' });

  // 2. Follow redirects for shortened URLs (goo.gl, maps.app.goo.gl, bit.ly, etc.)
  let finalUrl = url;
  try {
    const head = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(5000),
    });
    const resolved = head.url || url;
    // Re-validate after redirect: a short URL could redirect to an internal address
    if (isSafeUrl(resolved)) {
      finalUrl = resolved;
      const gmResolved = parseGoogleMapsPath(finalUrl);
      if (gmResolved) return res.json({ ...gmResolved, source: 'google-maps' });
    }
  } catch { /* HEAD/redirect failed — proceed with direct fetch */ }

  // 3. Fetch HTML and parse OG/Twitter tags
  try {
    const resp = await fetch(finalUrl, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' },
      signal: AbortSignal.timeout(8000),
    });
    const html = await resp.text();
    const og   = parseOgFromHtml(html);
    const source = /instagram\.com/i.test(finalUrl) ? 'instagram'
                 : /tiktok\.com/i.test(finalUrl)    ? 'tiktok'
                 : 'url';
    return res.json({ ...og, source });
  } catch {
    return res.status(422).json({ error: 'Could not extract data from this URL. Try adding the spot manually.' });
  }
}
