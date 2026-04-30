import { describe, it, expect } from 'vitest';
import { detectSource, parseGoogleMapsUrl, hostnameToName } from './urlParser.js';

describe('detectSource', () => {
  it('detects google.com/maps', () => {
    expect(detectSource('https://www.google.com/maps/place/Bangkok')).toBe('google-maps');
  });

  it('detects maps.app.goo.gl', () => {
    expect(detectSource('https://maps.app.goo.gl/abc123')).toBe('google-maps');
  });

  it('detects goo.gl/maps', () => {
    expect(detectSource('https://goo.gl/maps/xyz')).toBe('google-maps');
  });

  it('detects instagram.com', () => {
    expect(detectSource('https://www.instagram.com/p/ABC123/')).toBe('instagram');
  });

  it('detects tiktok.com', () => {
    expect(detectSource('https://www.tiktok.com/@user/video/123')).toBe('tiktok');
  });

  it('returns "other" for unrecognised URLs', () => {
    expect(detectSource('https://tripadvisor.com/restaurant/123')).toBe('other');
  });
});

describe('parseGoogleMapsUrl', () => {
  it('extracts name and coords from full place URL', () => {
    const result = parseGoogleMapsUrl(
      'https://www.google.com/maps/place/Grand+Palace/@13.7500,100.4913,17z'
    );
    expect(result).toMatchObject({
      name: 'Grand Palace',
      coordinates: { lat: 13.75, lng: 100.4913 },
    });
  });

  it('handles URL-encoded Thai characters', () => {
    const result = parseGoogleMapsUrl(
      'https://www.google.com/maps/place/%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7/@13.7489,100.4925,17z'
    );
    expect(result?.name).toBeTruthy();
    expect(result?.coordinates).not.toBeNull();
  });

  it('extracts from ?q= named place', () => {
    const result = parseGoogleMapsUrl('https://maps.google.com/?q=Chatuchak+Market');
    expect(result?.name).toBe('Chatuchak Market');
  });

  it('extracts coordinates from ?q=lat,lng', () => {
    const result = parseGoogleMapsUrl('https://maps.google.com/?q=13.7500,100.4913');
    expect(result?.coordinates).toMatchObject({ lat: 13.75, lng: 100.4913 });
  });

  it('returns null for non-Google Maps URL', () => {
    expect(parseGoogleMapsUrl('https://instagram.com/p/abc')).toBeNull();
  });

  it('returns null for shortened goo.gl URL (needs server redirect)', () => {
    expect(parseGoogleMapsUrl('https://maps.app.goo.gl/abc123')).toBeNull();
  });
});

describe('hostnameToName', () => {
  it('extracts domain name without www prefix', () => {
    expect(hostnameToName('https://www.klook.com/activity/123')).toBe('klook');
  });

  it('replaces hyphens with spaces', () => {
    expect(hostnameToName('https://trip-advisor.com/place')).toBe('trip advisor');
  });

  it('returns empty string for invalid URL', () => {
    expect(hostnameToName('not-a-url')).toBe('');
  });
});
