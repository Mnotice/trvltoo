import { describe, it, expect } from 'vitest';
import { isSafeUrl } from './urlSafety.js';

describe('isSafeUrl', () => {
  // ── Valid URLs ─────────────────────────────────────────────────────────────
  it('allows https public URLs', () => {
    expect(isSafeUrl('https://maps.google.com/maps?q=bangkok')).toBe(true);
  });

  it('allows http public URLs', () => {
    expect(isSafeUrl('http://instagram.com/p/abc123')).toBe(true);
  });

  it('allows URLs with paths and query strings', () => {
    expect(isSafeUrl('https://www.google.com/maps/place/Wat+Pho/@13.7465,100.4930,17z')).toBe(true);
  });

  // ── Protocol blocks ────────────────────────────────────────────────────────
  it('blocks file:// protocol', () => {
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
  });

  it('blocks ftp:// protocol', () => {
    expect(isSafeUrl('ftp://internal.host/file')).toBe(false);
  });

  it('blocks javascript: protocol', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
  });

  it('blocks data: URIs', () => {
    expect(isSafeUrl('data:text/html,<h1>xss</h1>')).toBe(false);
  });

  // ── Localhost blocks ───────────────────────────────────────────────────────
  it('blocks http://localhost', () => {
    expect(isSafeUrl('http://localhost')).toBe(false);
  });

  it('blocks http://localhost with port', () => {
    expect(isSafeUrl('http://localhost:5173')).toBe(false);
  });

  // ── Private IP blocks ──────────────────────────────────────────────────────
  it('blocks 127.0.0.1', () => {
    expect(isSafeUrl('http://127.0.0.1')).toBe(false);
  });

  it('blocks 10.x.x.x', () => {
    expect(isSafeUrl('http://10.0.0.1/admin')).toBe(false);
  });

  it('blocks 192.168.x.x', () => {
    expect(isSafeUrl('http://192.168.1.1')).toBe(false);
  });

  it('blocks 172.16.x.x (RFC-1918)', () => {
    expect(isSafeUrl('http://172.16.0.1')).toBe(false);
  });

  it('blocks 172.31.x.x (RFC-1918 upper boundary)', () => {
    expect(isSafeUrl('http://172.31.255.255')).toBe(false);
  });

  it('allows 172.32.x.x (just outside RFC-1918)', () => {
    expect(isSafeUrl('http://172.32.0.1')).toBe(true);
  });

  it('blocks 169.254.x.x (link-local / AWS metadata)', () => {
    expect(isSafeUrl('http://169.254.169.254/latest/meta-data/')).toBe(false);
  });

  it('blocks IPv6 loopback ::1', () => {
    expect(isSafeUrl('http://[::1]')).toBe(false);
  });

  // ── Malformed ──────────────────────────────────────────────────────────────
  it('blocks empty string', () => {
    expect(isSafeUrl('')).toBe(false);
  });

  it('blocks non-URL strings', () => {
    expect(isSafeUrl('not-a-url')).toBe(false);
  });

  it('blocks URLs with trailing dots on hostname', () => {
    // Trailing dot is a valid DNS form but normalised away in the check
    expect(isSafeUrl('http://localhost.')).toBe(false);
  });
});
