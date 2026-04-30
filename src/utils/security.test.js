import { describe, it, expect } from 'vitest';
import { sanitizeVibeData } from './security.js';

describe('sanitizeVibeData', () => {
  it('passes through clean data unchanged', () => {
    const data = { destination: 'Bangkok', energy: 7, nightIntensity: 4 };
    const result = sanitizeVibeData(data);
    expect(result.destination).toBe('Bangkok');
    expect(result.energy).toBe(7);
    expect(result.nightIntensity).toBe(4);
  });

  it('strips HTML tags from destination', () => {
    const result = sanitizeVibeData({ destination: '<script>Bangkok</script>' });
    expect(result.destination).toBe('scriptBangkok/script');
  });

  it('strips HTML tags from persona', () => {
    const result = sanitizeVibeData({ persona: '<b>adventurer</b>' });
    expect(result.persona).toBe('badventurer/b');
  });

  it('truncates destination to 50 chars', () => {
    const result = sanitizeVibeData({ destination: 'a'.repeat(80) });
    expect(result.destination).toHaveLength(50);
  });

  it('truncates persona to 50 chars', () => {
    const result = sanitizeVibeData({ persona: 'x'.repeat(60) });
    expect(result.persona).toHaveLength(50);
  });

  it('clamps energy below minimum to 1', () => {
    expect(sanitizeVibeData({ energy: -5 }).energy).toBe(1);
  });

  it('clamps energy above maximum to 10', () => {
    expect(sanitizeVibeData({ energy: 99 }).energy).toBe(10);
  });

  it('clamps nightIntensity below minimum to 1', () => {
    expect(sanitizeVibeData({ nightIntensity: 0 }).nightIntensity).toBe(1);
  });

  it('clamps nightIntensity above maximum to 10', () => {
    expect(sanitizeVibeData({ nightIntensity: 11 }).nightIntensity).toBe(10);
  });

  it('defaults energy to 5 when NaN', () => {
    expect(sanitizeVibeData({ energy: 'abc' }).energy).toBe(5);
  });

  it('defaults nightIntensity to 5 when undefined', () => {
    expect(sanitizeVibeData({}).nightIntensity).toBe(5);
  });

  it('preserves other fields untouched', () => {
    const data = { destination: 'Bali', custom: 'value', energy: 5, nightIntensity: 5 };
    expect(sanitizeVibeData(data).custom).toBe('value');
  });
});
