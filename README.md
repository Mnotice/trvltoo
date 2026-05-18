<div align="center">

# TRVLTOO

### Plan a perfect day in Southeast Asia — in under a minute.

Tell us where you're going, how you travel, and what you've got to spend.  
We'll build your Morning → Afternoon → Evening, powered by AI.

**[→ Start Planning](https://trvltoo.com)**

---

<!-- Replace with an animated GIF or screenshot grid. Suggested size: 1200×675px -->
![TRVLTOO Preview](docs/preview.gif)

</div>

---

## Everything you need for a great day

**Pick your destination**  
12 Thailand destinations — Bangkok, Phuket, Krabi, Chiang Mai, Chiang Rai, Koh Samui, Koh Phangan, Koh Tao, Ayutthaya, Hua Hin, Pai, Koh Lanta — each with curated local intel built in.

**Tell us how you travel**  
Choose a persona (Culture Seeker, Party Animal, Foodie, Adventure, Luxury, Backpacker), set your energy level, pick your budget. The itinerary adapts to you.

**Focus on the right part of town**  
Select an area within your destination — Sukhumvit vs Old City in Bangkok, Patong vs Kata in Phuket — and every suggestion lands in the right neighbourhood.

**Swap anything you don't love**  
Hit re-roll on any slot to get an alternative. Lock the ones you want to keep. Iterate until it's exactly right.

**Take it with you**  
Export your itinerary as a PDF or Markdown file. Or save it to your account and access it from any device.

**Share it with someone**  
Every saved trip gets a shareable link with a full social preview — send it over WhatsApp and they'll see exactly where you're going.

---

## How it works

| | |
|---|---|
| **1. Choose your destination** | Pick from 12 handpicked Thailand locations |
| **2. Set your preferences** | Arrival date, area, persona, energy, budget |
| **3. Get your day** | AI builds a 3-slot itinerary in seconds |
| **4. Refine it** | Re-roll, lock, tweak until it's perfect |
| **5. Save & share** | Export or send a link |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn
- A Firebase project
- API keys for Gemini and other services

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/trvltoo.git
cd trvltoo

# Install dependencies
npm install
cd functions && npm install && cd ..

# Set up environment variables
cp .env.example .env
cp .env.example .env.local
# Edit .env and .env.local with your API keys (see .env.example for details)

# Start development server
npm run dev
```

The app will run at `http://localhost:5173`

### Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup instructions including API key configuration.

---

## Architecture

**Frontend:** React 19 + Vite + Tailwind CSS  
**Backend:** Firebase (Firestore, Auth, Storage) + Vercel Functions  
**AI:** Google Gemini API + Anthropic Claude  
**Database:** Firestore + Supabase (for knowledge base)

### Key Components
- **Trip Planner:** AI-powered itinerary generation with personalization
- **Spot Collector:** Collect and curate interesting places
- **Map View:** Leaflet-based map with clustering
- **Export:** PDF and Markdown export functionality
- **Social Preview:** Open Graph support for sharing


---

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide to get started.

### Development Commands
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run ESLint
npm run test        # Run tests
npm run test:watch  # Watch mode for tests
npm test:coverage   # Coverage report
```

---

## Built with

React 19 · Vite · Tailwind CSS · Firebase · Google Gemini · Framer Motion

---

## Technology Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context + Hooks
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **AI Models:** Google Gemini, Anthropic Claude
- **Maps:** Leaflet + React-Leaflet
- **Payments:** Stripe (optional)
- **Deployment:** Firebase Hosting / Vercel

---

## Project Status

TRVLTOO is actively maintained and open for contributions. We're continually adding features and expanding to more destinations.

---

## Roadmap

- [ ] Extend beyond Thailand to other Southeast Asian countries
- [ ] Advanced filtering and search capabilities
- [ ] Collaborative trip planning
- [ ] Integration with booking platforms
- [ ] Mobile app (React Native)
- [ ] Offline support improvements
- [ ] More AI personalization options

---

## License

[MIT](LICENSE)

---

## Questions or Issues?

- 📖 [Read the documentation](./docs)
- 🐛 [Open an issue](https://github.com/yourusername/trvltoo/issues)
- 💬 [Start a discussion](https://github.com/yourusername/trvltoo/discussions)
- 📧 [Contact us](mailto:support@trvltoo.com)

---

**Made with ❤️ for travelers**
