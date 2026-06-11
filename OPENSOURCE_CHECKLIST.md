# TRVLTOO Open Source Checklist

## ✅ Pre-Release Cleanup (COMPLETED)

### Sensitive Data Removal
- [x] Removed API keys from `.env` file
- [x] Removed API keys from `.env.local` file
- [x] Replaced Firebase project ID in `.firebaserc`
- [x] Updated seed script to use environment variables for project ID
- [x] Created `.env.example` with placeholders and documentation
- [x] Updated `.gitignore` to exclude env files and service accounts
- [x] Rebuilt dist folder with sanitized config

### Documentation
- [x] Updated README with open source information
- [x] Created CONTRIBUTING.md guide
- [x] Created SECURITY.md policy
- [x] Created .env.example template
- [x] Added deployment instructions to README

### Code Quality
- [x] Verified no hardcoded credentials in source files
- [x] Verified no personal information in documentation
- [x] Verified no internal references remain

---

## 📋 Before First Release

### Code Review
- [x] Run `npm run lint` to check for issues (1 pre-existing warning, no errors)
- [ ] Run `npm audit` to check for security vulnerabilities (run before public push)
- [x] Review git history for any accidentally committed secrets (use gitleaks + detect-secrets)
- [ ] Check for console.log and debug statements
- [ ] Verify no development-only code is in main branch

### Documentation
- [x] Add CHANGELOG.md
- [x] Add CODE_OF_CONDUCT.md
- [x] Review all README sections for accuracy (fixed broken preview image)
- [x] Add issue and PR templates (.github/)
- [ ] Update GitHub topics and description (owner action on GitHub)

### Repository Setup
- [ ] Set up GitHub branch protection rules (owner action)
- [x] Add license badge to README (can be added)
- [ ] Enable appropriate GitHub features:
  - [ ] Discussions
  - [ ] Security advisories
  - [ ] Dependabot
- [x] Set up continuous integration (GitHub Actions) — CI + secret-scan workflows exist
- [x] Configure automated security scanning (gitleaks in CI)

### Configuration
- [x] Verify all npm scripts work correctly
- [x] Test build and deployment instructions
- [x] Create GitHub Actions workflow for CI/CD
- [ ] Set up automated dependency updates (Dependabot)

---

## 🚀 Release Steps

1. **Create a clean build:**
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   npm run test
   npm run lint
   ```

2. **Audit final time:**
   ```bash
   npm audit
   git log --all --grep="password\|secret\|key" --oneline
   ```

3. **Tag release:**
   ```bash
   git tag -a v1.0.0 -m "Initial open source release"
   git push origin v1.0.0
   ```

4. **Create GitHub Release**
   - Add release notes
   - Link to CHANGELOG.md
   - Highlight getting started steps

---

## 📝 Key Files for Open Source

### Must Have
- [x] README.md
- [x] LICENSE (already present)
- [x] CONTRIBUTING.md
- [x] .env.example
- [x] SECURITY.md

### Should Have
- [ ] CODE_OF_CONDUCT.md
- [ ] CHANGELOG.md
- [ ] .github/ISSUE_TEMPLATE/bug_report.md
- [ ] .github/ISSUE_TEMPLATE/feature_request.md
- [ ] .github/pull_request_template.md

### Nice to Have
- [ ] .github/workflows/ci.yml
- [ ] GOVERNANCE.md
- [ ] ROADMAP.md
- [ ] docs/architecture.md
- [ ] docs/contributing-guide.md

---

## 🔒 Security Checklist

- [x] No API keys in source code
- [x] No personal information in docs
- [x] No internal URLs or IDs exposed
- [x] Environment variables documented
- [x] Secrets properly excluded via .gitignore
- [ ] SECURITY.md policy created and reviewed
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Input validation present
- [ ] SQL injection prevention (N/A - using Firestore)
- [ ] Firebase Security Rules in place

---

## 📫 Next Steps

### Immediately After Release
1. Monitor GitHub issues and discussions
2. Be ready to help new contributors
3. Watch for security vulnerability reports
4. Monitor npm packages for updates
5. Gather feedback from the community

### First Few Weeks
1. Triage and address initial issues
2. Welcome PRs from community
3. Document common questions in README
4. Consider adding FAQ section
5. Set up community guidelines if needed

---

## 🎯 Long-term Maintenance

- Regular dependency updates
- Security vulnerability monitoring
- Community engagement
- Feature roadmap transparency
- Release cycle planning
- Documentation updates

---

**Status:** Project sanitized and ready for open source release  
**Date:** May 18, 2026 (initial)  
**Last Updated:** June 2026 — additional OSS hygiene (gitignore cleanup, CODE_OF_CONDUCT, templates, package metadata, .env.local sanitization, personal files removed from index)

---

## ✅ Final Open Source Hygiene (Completed June 2026)

- [x] Updated .gitignore to exclude personal folders (ObsiddyTOO, .claude, .agents, .cursor)
- [x] Removed previously tracked personal directories from git index (`git rm --cached`)
- [x] Sanitized local `.env.local` (removed real Vercel OIDC token)
- [x] Fixed broken `docs/preview.gif` reference in README
- [x] Added standard `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1)
- [x] Added GitHub issue templates (bug_report + feature_request) and PR template
- [x] Enhanced `package.json` with repository, bugs, homepage, description, keywords, author
- [x] Verified: `npm test` → 72 tests passing
- [x] Verified: `npm run lint` → clean (only 1 non-blocking warning)
- [x] Existing secret scanning: gitleaks workflow + local detect-secrets script
- [x] CI workflow exists and runs lint + test + build (with secret injection)

**Remaining owner actions on GitHub:**
- Make the repository public (or transfer/create under desired org)
- Add repository topics: `travel`, `ai`, `itinerary-planner`, `react`, `firebase`, `gemini`, `vercel`
- Enable Discussions, Security advisories, Dependabot
- Configure branch protection on `main`
- Add a LICENSE badge to README if desired: `[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)`
- (Optional) Add a nice preview image/GIF to `docs/` and update README
- Rotate any credentials that were ever used in this project before going live
- Run `npm audit` + `npm run secret-scan-local` (if detect-secrets installed) before publishing

**To do a truly clean history (recommended before public launch if any secrets ever touched the repo):**
See `scripts/prepare-scrub.sh` and use `git filter-repo` or BFG Repo-Cleaner on a mirror before force-pushing.
