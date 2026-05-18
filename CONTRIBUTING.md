# Contributing to TRVLTOO

Thank you for your interest in contributing to TRVLTOO! This guide will help you get set up and started.

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: use `nvm`)
- npm or yarn
- Firebase CLI (for backend deployment)
- Git

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/trvltoo.git
   cd trvltoo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   cp .env.example .env.local
   
   # Edit both files with your own API keys
   # See .env.example for where to get each key
   ```

4. **Configure Firebase (optional for local dev):**
   ```bash
   npx firebase login
   npx firebase use --add
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Setting Up API Keys

You'll need to configure these services:

### 1. Firebase
- Create a project at [console.firebase.google.com](https://console.firebase.google.com)
- Copy your config from Project Settings
- Enable Authentication (Google Sign-In), Firestore Database, and Storage

### 2. Google Gemini API
- Create a project at [Google Cloud Console](https://console.cloud.google.com)
- Enable the Gemini API
- Create an API key

### 3. RapidAPI
- Sign up at [RapidAPI](https://rapidapi.com)
- Get API keys for weather and other data sources

### 4. Anthropic Claude (Optional - for server-side generation)
- Create an account at [console.anthropic.com](https://console.anthropic.com)
- Get your API key

### 5. Stripe (Optional - for payments)
- Create an account at [stripe.com](https://stripe.com)
- Get your secret key and product price IDs

## Development Guidelines

### Code Style
- Follow existing code style in the project
- Use ESLint: `npm run lint`
- Components should be functional and use React hooks

### Testing
- Run tests: `npm run test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:coverage`

### Commits
- Use clear, descriptive commit messages
- Reference issues when applicable: `Fix #123`
- Keep commits focused on a single change

### Pull Requests
- Create a feature branch: `git checkout -b feature/description`
- Push and create a PR with a clear description
- Link related issues
- Ensure tests pass before submitting

## Project Structure

```
trvltoo/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services (Gemini, Claude, Firestore, etc.)
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── data/          # Static data and configurations
│   └── db/            # Database service layer
├── functions/         # Firebase Cloud Functions
├── api/              # Vercel API routes (serverless functions)
├── public/           # Static assets
└── docs/             # Documentation
```

## Common Tasks

### Add a new environment variable
1. Update `.env.example`
2. Add to `.env` and `.env.local` with your value
3. If it's client-side (browser), prefix with `VITE_`
4. Reference using `import.meta.env.VITE_YOUR_VAR`

### Deploy to production
```bash
# Requires Firebase project setup
npm run build
firebase deploy
```

### Run Firebase emulators locally
```bash
npx firebase emulators:start
```

## Troubleshooting

### "Module not found" errors
- Run `npm install` in root and `functions/` directories
- Clear node_modules: `rm -rf node_modules && npm install`

### Port already in use
- The dev server uses port 5173. If busy, Vite will use the next available port
- For Firebase emulators, use different ports: `firebase emulators:start --import=./seed-data`

### Build errors
- Clear dist folder: `rm -rf dist`
- Rebuild: `npm run build`

## Security

- **Never commit `.env` files** - they're in `.gitignore`
- **Never expose API keys in code** - use environment variables
- **Review security guidelines** in the codebase before adding authentication logic
- Server-side API keys (ANTHROPIC_API_KEY) should only be used in `api/` or `functions/`

## Questions or Issues?

- Check existing [GitHub Issues](https://github.com/yourusername/trvltoo/issues)
- Join our community discussions
- Read the [README.md](README.md) for project overview

## License

By contributing, you agree that your contributions will be licensed under the project's license.

Happy coding! 🚀
