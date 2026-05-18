# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in TRVLTOO, please **do not** open a public GitHub issue. Instead, please report it responsibly:

1. **Email:** [Mail](mailto:mikhail1337@hotmail.com) with details about the vulnerability
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if applicable)

We appreciate responsible disclosure and will acknowledge receipt within 48 hours.

## Security Guidelines for Contributors

### ✅ DO:
- Use environment variables for all sensitive data (API keys, secrets, database URLs)
- Store secrets in `.env.local` (never commit this file)
- Use `.env.example` as a template with placeholder values
- Review code for hardcoded credentials before committing
- Use Firebase Security Rules to protect Firestore data
- Enable authentication before accessing protected resources
- Use HTTPS for all external API calls
- Validate and sanitize all user input

### ❌ DON'T:
- Commit `.env` or `.env.local` files
- Hardcode API keys, passwords, or credentials
- Log sensitive information
- Expose internal URLs or project IDs
- Use weak or placeholder security rules in production
- Store secrets in comments or documentation
- Make API keys publicly visible in client-side code (server-side only)
- Use outdated or unsecured dependencies

## Sensitive Data Already Removed

This project has been prepared for open source release. The following has been sanitized:

✅ All API keys removed from `.env` and `.env.local`  
✅ Firebase project ID changed to placeholder in `.firebaserc`  
✅ Production configuration files excluded  
✅ Service account credentials removed  
✅ Personal/internal documentation removed  

## Environment Variables

**Server-side only (Never expose to browser):**
- `ANTHROPIC_API_KEY`
- `STRIPE_SECRET_KEY`

**Client-side (Prefixed with VITE_):**
- Cannot be treated as secure
- Publicly viewable in browser devtools
- Don't use for API secrets
- Use CORS-protected backend routes for sensitive operations

## Production Deployment

Before deploying to production:

1. **Rotate all credentials:**
   - Generate new Firebase API keys
   - Create new payment processor credentials
   - Update all third-party API keys

2. **Configure security:**
   - Set up Firebase Security Rules
   - Enable authentication providers
   - Configure CORS properly
   - Set environment variables on hosting platform

3. **Review code:**
   - Run `npm run lint` to check for issues
   - Use security tools: `npm audit`
   - Check for hardcoded secrets: `git grep -i "password\|secret\|key"`

4. **Monitor:**
   - Enable logging and monitoring
   - Set up security alerts
   - Regularly rotate credentials
   - Monitor for suspicious activity

## Dependency Security

Keep dependencies up to date:
```bash
npm audit           # Check for vulnerabilities
npm audit fix       # Attempt to fix automatically
npm update          # Update to latest compatible versions
```

## Third-party Service Security

### Firebase
- Use Security Rules to validate data access
- Enable authentication before access
- Regularly review and audit Firestore data
- Use separate Firebase projects for dev/prod

### Stripe
- Never log card information
- Always use HTTPS
- Implement PCI compliance measures
- Use webhook signatures for validation

### Google Gemini / Anthropic APIs
- Rotate API keys regularly
- Monitor API usage for anomalies
- Keep API keys in server-side environment variables only

## License & Compliance

- Review [LICENSE](LICENSE) before using this project
- Comply with all third-party service terms of service
- Ensure GDPR/privacy law compliance when handling user data

---

**Last Updated:** May 18, 2026

For questions about security, please reach out through our security reporting channels.
