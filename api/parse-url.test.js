import { describe, it, expect } from 'vitest';
import { parseGoogleMapsPath, parseOgFromHtml } from './parse-url.js';

describe('parseGoogleMapsPath', () => {
  it('extracts name and coords from /maps/place/ path', () => {
    const result = parseGoogleMapsPath(
      'https://www.google.com/maps/place/Wat+Pho/@13.7465,100.4930,17z'
    );
    expect(result).toMatchObject({
      name: 'Wat Pho',
      coordinates: { lat: 13.7465, lng: 100.493 },
    });
  });

  it('extracts name from /maps/search/ path', () => {
    const result = parseGoogleMapsPath(
      'https://www.google.com/maps/search/street+food/@13.75,100.49,15z'
    );
    expect(result).toMatchObject({ name: 'street food' });
  });

  it('extracts place name from ?q= param', () => {
    const result = parseGoogleMapsPath(
      'https://maps.google.com/?q=Grand+Palace+Bangkok'
    );
    expect(result?.name).toBe('Grand Palace Bangkok');
  });

  it('extracts coords from ?q=lat,lng', () => {
    const result = parseGoogleMapsPath(
      'https://maps.google.com/?q=13.7465,100.4930'
    );
    expect(result?.coordinates).toMatchObject({ lat: 13.7465, lng: 100.493 });
  });

  it('returns null for non-Google Maps URLs', () => {
    expect(parseGoogleMapsPath('https://instagram.com/p/abc')).toBeNull();
  });

  it('returns null for shortened Maps URLs (maps.app.goo.gl)', () => {
    expect(parseGoogleMapsPath('https://maps.app.goo.gl/abc123')).toBeNull();
  });

  it('returns null for malformed URLs', () => {
    expect(parseGoogleMapsPath('not-a-url')).toBeNull();
  });
});

describe('parseOgFromHtml', () => {
  it('extracts og:title and og:image', () => {
    const html = `
      <meta property="og:title" content="Sukhumvit Noodle House" />
      <meta property="og:image" content="https://example.com/img.jpg" />
      <meta property="og:description" content="Best noodles in Bangkok" />
    `;
    const result = parseOgFromHtml(html);
    expect(result.name).toBe('Sukhumvit Noodle House');
    expect(result.imageUrl).toBe('https://example.com/img.jpg');
    expect(result.notes).toBe('Best noodles in Bangkok');
  });

  it('falls back to twitter:title when og:title is missing', () => {
    const html = `<meta name="twitter:title" content="Beach Bar Koh Samui" />`;
    expect(parseOgFromHtml(html).name).toBe('Beach Bar Koh Samui');
  });

  it('strips " on Instagram" suffix from title', () => {
    const html = `<meta property="og:title" content="Cool spot on Instagram" />`;
    expect(parseOgFromHtml(html).name).toBe('Cool spot');
  });

  it('strips " on TikTok" suffix from title', () => {
    const html = `<meta property="og:title" content="Cool spot on TikTok" />`;
    expect(parseOgFromHtml(html).name).toBe('Cool spot');
  });

  it('extracts place coordinates', () => {
    const html = `
      <meta property="place:location:latitude" content="13.7465" />
      <meta property="place:location:longitude" content="100.4930" />
    `;
    expect(parseOgFromHtml(html).coordinates).toMatchObject({ lat: 13.7465, lng: 100.493 });
  });

  it('returns null coordinates when not present', () => {
    expect(parseOgFromHtml('<html></html>').coordinates).toBeNull();
  });

  it('returns empty strings for missing fields', () => {
    const result = parseOgFromHtml('<html></html>');
    expect(result.name).toBe('');
    expect(result.imageUrl).toBe('');
    expect(result.notes).toBe('');
  });
});
