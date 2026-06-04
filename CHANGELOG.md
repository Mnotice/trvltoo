# Changelog

All notable changes to this project are documented here.

## [0.1.0] - 2026-06-04

### Added
- `docs/CODEBASE.md` — repository and architecture map for contributors
- `CHANGELOG.md` — release history starting at v0.1.0

### Changed
- Package version set to `0.1.0` (first open-source baseline)
- `/plan` route lazy-loads `Planner` directly (removed redundant `App.jsx` wrapper)
- Vitest excludes `functions/node_modules` so CI runs only project tests
- README and CONTRIBUTING GitHub URLs point to `Mnotice/trvltoo`
- `.gitignore` excludes `.venv-secrets/`

### Fixed
- `package.json` scripts formatting
- README: `npm run test:coverage` command typo

[0.1.0]: https://github.com/Mnotice/trvltoo/releases/tag/v0.1.0