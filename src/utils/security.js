/**
 * Protocol #11: Environment Variable Validation
 * Ensures the app doesn't silently fail in production due to missing secrets.
 */
export const performSecurityStartupAudit = () => {
  const REQUIRED_KEYS = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missing = REQUIRED_KEYS.filter(key => !import.meta.env?.[key]);
  
  if (missing.length > 0) {
    throw new Error(`SECURITY AUDIT FAILURE: Missing essential environment keys: ${missing.join(', ')}`);
  }
  
  console.info("🛡️ SECURITY AUDIT: Environment variables validated successfully.");
  return true;
};

/**
 * Protocol #3: Input Sanitization
 * Prevents XSS and buffer overflow via user-submitted "Vibe" data.
 */
export const sanitizeVibeData = (data) => {
  const sanitized = { ...data };
  
  // Sanitize specific string fields
  if (sanitized.persona) {
    sanitized.persona = sanitized.persona
      .replace(/[<>]/g, '') // Basic tag stripping
      .substring(0, 50)      // Enforce buffer limit 
      .trim();
  }
  
  if (sanitized.destination) {
    sanitized.destination = sanitized.destination
      .replace(/[<>]/g, '')
      .substring(0, 50)
      .trim();
  }

  // Ensure numeric constraints are strictly adhered to
  // Use Number.isNaN to avoid treating 0 as falsy (0 should clamp to 1, not default to 5)
  const energyRaw = Number(sanitized.energy);
  sanitized.energy = Math.min(Math.max(Number.isNaN(energyRaw) ? 5 : energyRaw, 1), 10);
  const nightRaw = Number(sanitized.nightIntensity);
  sanitized.nightIntensity = Math.min(Math.max(Number.isNaN(nightRaw) ? 5 : nightRaw, 1), 10);
  
  return sanitized;
};
