# TRVLTOO → Roamy Competitor Strategic Plan

## 🎯 Vision
Transform TRVLTOO from a **single-day Thailand itinerary planner** into a **global multi-day trip planner with spot-saving, AI itinerary building, and collaborative features** — competing directly with Roamy.

---

## 📊 Current State vs. Target State

### Current TRVLTOO
- ✅ Single-day itineraries only
- ✅ Thailand destinations only (12 cities)
- ✅ Persona-based customization (Culture Seeker, Foodie, etc.)
- ✅ AI-powered (Google Gemini)
- ✅ Re-roll/lock UI mechanics
- ✅ Export (PDF/Markdown)
- ✅ Firebase + React 19 + Vite stack

### Target State (Roamy Competitor)
- 🎯 **Multi-day trip planning** (3-14 days)
- 🎯 **Global destination support** (start with SE Asia, expand globally)
- 🎯 **Spot-saving system** (save from Instagram, TikTok, Google Maps, manual entry)
- 🎯 **Live map view** (display all saved spots on interactive map)
- 🎯 **Itinerary builder** (Claude AI optimizes route, generates day-by-day plans)
- 🎯 **List organization** (organize spots by city, trip, category)
- 🎯 **Collaborative planning** (invite friends, shared collections)
- 🎯 **Social sharing** (shareable links with preview cards)
- 🎯 **Modern landing page** (hero section, feature showcase, app mockup)
- 🎯 **Claude API integration** (replace Gemini with Claude for better itinerary generation)

---

## 🏗️ Architecture Overview

```
TRVLTOO Competitor Stack:
├── Frontend (React 19 + Vite)
│   ├── Landing page (hero, features, CTAs)
│   ├── Spot-saving interface (drag-drop, URL parsing, manual entry)
│   ├── Map view (Leaflet or Google Maps)
│   ├── Trip planner (date picker, itinerary builder UI)
│   ├── Collections/Lists (organize spots)
│   └── Share/Export (shareable links, PDF, JSON)
│
├── Backend (Firebase)
│   ├── Firestore (users, trips, spots, collections)
│   ├── Auth (Google, email)
│   ├── Storage (images, exports)
│   └── Real-time sync (collaborative editing)
│
├── AI Engine (Claude API)
│   ├── Spot extraction (parse URLs, images, text)
│   ├── Route optimization (best order for spots)
│   ├── Itinerary generation (day-by-day breakdown)
│   └── Recommendations (new spots based on preferences)
│
└── Third-party Integrations
    ├── Google Maps API (spot details, directions)
    ├── Instagram/TikTok parsing (URL → location extraction)
    └── Social sharing (OG tags for preview)
```

---

## 📋 Feature Breakdown & Roadmap

### Phase 1: Core Experience (MVP) — 2-3 weeks
**Goal:** Functional spot-saving and multi-day planning

#### 1.1 Spot Collection System
- [ ] **Spot model** (name, address, coordinates, category, source, image, notes)
- [ ] **Multiple input methods:**
  - [ ] Manual entry (form: name, address, search)
  - [ ] URL parsing (extract location from Google Maps, Instagram, TikTok URLs)
  - [ ] Screenshot upload (OCR → address extraction using Claude Vision)
  - [ ] Drag-drop (save text, coordinates, images)
- [ ] **Spot storage** in Firestore under user's account
- [ ] **Image hosting** (Firebase Storage or Cloudinary)

#### 1.2 Trip & Collections
- [ ] **Trip model** (name, destination, start_date, end_date, spots[], creator, collaborators)
- [ ] **Collections/Lists** (organize spots by: city, category, trip)
- [ ] **Trip creation workflow:**
  - [ ] Choose destination (autocomplete: supports global cities)
  - [ ] Pick dates (date range picker: 3-14 days)
  - [ ] Select which lists/spots to include
  - [ ] Review & confirm

#### 1.3 Claude AI Itinerary Builder
- [ ] **Claude API integration** (replace Gemini)
- [ ] **Prompt design** for:
  - [ ] Route optimization (best order to visit spots)
  - [ ] Time allocation (how long at each spot)
  - [ ] Day breakdown (3 meals + activities per day)
  - [ ] Transport suggestions (walking, transit, taxi)
  - [ ] Budget estimation
- [ ] **Streaming response** (show itinerary building in real-time)
- [ ] **Fallback itinerary** if API fails
- [ ] **Save itinerary** to Firestore

#### 1.4 Live Map View
- [ ] **Map integration** (Leaflet.js or Google Maps SDK)
- [ ] **Display all saved spots** with markers
- [ ] **Marker clustering** (when zoomed out)
- [ ] **Filter options:**
  - [ ] By category (food, attraction, hotel, etc.)
  - [ ] By trip
  - [ ] By list
- [ ] **Click marker** → spot details popup
- [ ] **Draw route** (connect spots in itinerary order)

#### 1.5 Modern Landing Page
- [ ] **Hero section:**
  - [ ] Headline: "You save the spots. We'll handle the rest."
  - [ ] Subheadline: "Turn your saved travel ideas into real itineraries"
  - [ ] CTA buttons: "Start Planning" + "Sign Up"
- [ ] **Feature showcase** (4-5 cards with icons):
  - [ ] "Save spots from anywhere" (Instagram, TikTok, Maps, screenshots)
  - [ ] "AI itinerary builder" (Claude optimizes your route)
  - [ ] "See everything on a map" (live map with all spots)
  - [ ] "Organize with lists" (curate by city/trip/vibe)
  - [ ] "Plan together" (invite friends, collaborate)
- [ ] **How it works** (3-step flow with visuals)
- [ ] **App mockup** (hero phone image showing the app)
- [ ] **Footer** (links, social, legal)

#### 1.6 Export & Sharing
- [ ] **Shareable links** (unique URL per trip with preview)
- [ ] **Social preview cards** (OG tags: title, description, image)
- [ ] **Export formats:**
  - [ ] PDF (styled itinerary with maps, images)
  - [ ] JSON (raw data for sync across apps)
  - [ ] Markdown (simple text format)
- [ ] **Copy to clipboard** (itinerary as text)

### Phase 2: Polish & Expansion — 2-3 weeks
**Goal:** Scale globally, add collaborative features, improve UX

#### 2.1 Collaborative Planning
- [ ] **Trip sharing** (send invite link to friends)
- [ ] **Real-time collaboration** (Firestore listeners for live updates)
- [ ] **Friend lists** (follow other travelers, see their collections)
- [ ] **Comments** (on spots and itineraries)
- [ ] **Voting** (upvote spots to prioritize in itinerary)

#### 2.2 Global Expansion
- [ ] **Expand destinations** beyond Thailand
  - [ ] Start: SE Asia (Vietnam, Cambodia, Laos, Indonesia, Malaysia, Philippines)
  - [ ] Phase 2: Europe, Americas, Africa, Asia-Pacific
- [ ] **Destination intelligence** (curated local knowledge per city)
  - [ ] Best neighborhoods
  - [ ] Budget by area
  - [ ] Safety info
  - [ ] Transportation

#### 2.3 Enhanced AI Features
- [ ] **Smart recommendations** (Claude suggests new spots based on itinerary)
- [ ] **Budget tracking** (Claude estimates costs per day, total)
- [ ] **Persona-based customization** (keep existing: Culture Seeker, Foodie, etc.)
- [ ] **Travel style** (solo, couple, family, group)

#### 2.4 Mobile App Considerations
- [ ] **PWA (Progressive Web App)** (works offline, installable)
- [ ] **Native mobile** (React Native for iOS/Android — future)
- [ ] **QR code sharing** (scan to view itinerary)

### Phase 3: Monetization & Scale — Ongoing
**Goal:** Sustainable business model

- [ ] **Freemium model:**
  - [ ] Free: up to 3 trips, basic exports
  - [ ] Pro: unlimited trips, advanced AI, priority support
  - [ ] Team: collaborative features, team management
- [ ] **Affiliate partnerships** (hotels, restaurants, tour operators)
- [ ] **API for travel brands** (embed TRVLTOO into other platforms)

---

## 🛠️ Technical Implementation Details

### Frontend Components (React)

```
src/
├── components/
│   ├── Landing/
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── HowItWorks.jsx
│   │   └── Footer.jsx
│   ├── Dashboard/
│   │   ├── Sidebar.jsx
│   │   ├── TripList.jsx
│   │   └── QuickStats.jsx
│   ├── SpotCollector/
│   │   ├── ManualEntryForm.jsx
│   │   ├── URLParser.jsx
│   │   ├── ScreenshotUploader.jsx
│   │   └── SpotPreview.jsx
│   ├── Map/
│   │   ├── MapView.jsx
│   │   ├── MarkerCluster.jsx
│   │   ├── RouteOverlay.jsx
│   │   └── FilterPanel.jsx
│   ├── TripPlanner/
│   │   ├── DateRangePicker.jsx
│   │   ├── DestinationSelector.jsx
│   │   ├── ListSelector.jsx
│   │   └── ItineraryBuilder.jsx
│   ├── Itinerary/
│   │   ├── ItineraryView.jsx
│   │   ├── DayCard.jsx
│   │   ├── ActivityCard.jsx
│   │   └── EditActivityModal.jsx
│   ├── Share/
│   │   ├── ShareModal.jsx
│   │   ├── ExportOptions.jsx
│   │   └── SocialPreview.jsx
│   └── Collaboration/
│       ├── InviteFriend.jsx
│       ├── CollaboratorsList.jsx
│       └── CommentThread.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Dashboard.jsx
│   ├── TripDetail.jsx
│   ├── SpotCollection.jsx
│   ├── ItineraryEditor.jsx
│   └── ProfileSettings.jsx
├── services/
│   ├── firebaseService.js (Firestore CRUD)
│   ├── claudeService.js (Claude API calls)
│   ├── googleMapsService.js (Maps integration)
│   ├── imageService.js (upload, process)
│   └── urlParserService.js (parse social media URLs)
├── hooks/
│   ├── useTrips.js
│   ├── useSpots.js
│   ├── useAuth.js
│   ├── useItinerary.js
│   └── useMap.js
└── utils/
    ├── dateUtils.js
    ├── coordinateUtils.js
    ├── exportUtils.js (PDF, JSON, Markdown)
    └── shareUtils.js (OG tags, preview)
```

### Firestore Schema

```javascript
// Collections:

users/ {uid}
├── email
├── displayName
├── profileImage
├── createdAt
└── preferences (persona, currency, language)

trips/ {tripId}
├── name
├── destination (city, country, coordinates)
├── startDate
├── endDate
├── creator (userId)
├── collaborators [userId, userId...]
├── spots [spotId, spotId...]
├── itinerary (generated AI plan)
├── budget (total, daily breakdown)
├── createdAt
├── updatedAt
└── isPublic (for sharing)

spots/ {spotId}
├── name
├── address
├── coordinates {lat, lng}
├── category (food, hotel, attraction, etc.)
├── source (manual, instagram, maps, screenshot)
├── description
├── image (storage path or URL)
├── notes
├── rating
├── creator (userId)
├── createdAt
└── trips [tripId, tripId...]

collections/ {collectionId}
├── name
├── description
├── creator (userId)
├── spots [spotId, spotId...]
├── category (trip, city, vibe, etc.)
├── isPublic
├── collaborators [userId, userId...]
└── createdAt

shares/ {shareId}
├── tripId
├── creator (userId)
├── expiresAt
├── password (optional)
└── viewCount
```

### Claude API Integration

```javascript
// Example: Itinerary generation prompt

const generateItinerary = async (spots, trip) => {
  const message = await claude.messages.create({
    model: "claude-opus-4-20250805",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `
        Generate a ${trip.endDate - trip.startDate} day itinerary for ${trip.destination}.
        
        Saved spots:
        ${spots.map(s => `- ${s.name} (${s.category}): ${s.address}`).join('\n')}
        
        Constraints:
        - Budget: ${trip.budget}
        - Travel style: ${trip.persona}
        - Include 3 meals per day
        - Optimize route (minimize travel time)
        - Provide time allocation per activity
        - Suggest transport between spots
        
        Format as JSON:
        {
          day: 1,
          title: "...",
          activities: [
            { time: "9:00 AM", title: "...", spot: {...}, duration: "1 hour", notes: "..." }
          ],
          totalBudget: 0,
          tips: "..."
        }
      `
    }]
  });
  
  return parseJSON(message.content[0].text);
};
```

---

## 🎨 Design System

### Color Palette (Roamy-inspired)
- **Primary:** Clean blue (#0066CC or similar)
- **Secondary:** Light gray backgrounds (#F5F5F5)
- **Accent:** Warm orange for CTAs (#FF6B35 or similar)
- **Text:** Dark gray (#333)
- **Borders:** Light gray (#E0E0E0)

### Typography
- **Headings:** Bold, sans-serif (Inter, Poppins, or similar)
- **Body:** Regular, clean sans-serif
- **Monospace:** Code snippets, JSON preview

### Components
- **Cards:** Rounded corners (8-12px), subtle shadow
- **Buttons:** Rounded (6-8px), consistent padding
- **Inputs:** Clean borders, focus states
- **Modals:** Overlay with slide-in from right/bottom
- **Maps:** Responsive, mobile-friendly

---

## 📱 Mobile-First Approach

- **Responsive breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Touch-friendly:** Buttons 44px+, spacing for thumb
- **Map interactions:** Swipe gestures, pinch-to-zoom
- **Spot preview:** Carousel on mobile, grid on desktop

---

## 🔐 Security & Privacy

- **Authentication:** Firebase Auth (Google, Email)
- **Firestore rules:** User-based access control
- **Data encryption:** TLS in transit, encrypted at rest
- **GDPR compliance:** Data deletion, export, privacy policy
- **Rate limiting:** Claude API calls per user/day
- **Image handling:** Validate uploads, compress, scan for NSFW

---

## 📊 Analytics & Monitoring

- **Tracking:**
  - User journey (landing → sign-up → first trip → share)
  - Feature usage (which tools used most)
  - Claude API costs
  - Error tracking (Sentry)
- **Performance:**
  - Page load times (Lighthouse)
  - Map rendering
  - API response times
- **User feedback:** In-app surveys, feature requests

---

## 🚀 Deployment & DevOps

- **Frontend:** Vercel or Firebase Hosting (automatic deploys from main branch)
- **Backend:** Firebase (serverless, auto-scaling)
- **CI/CD:** GitHub Actions (test, lint, deploy)
- **Environment variables:** .env.local (never commit secrets)
- **Staging:** Separate Firebase project for testing
- **Monitoring:** Firebase Console + custom dashboards

---

## 🗺️ Implementation Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1: MVP** | 2-3 weeks | Spot-saving, Map, Itinerary builder, Landing page |
| **Phase 2: Polish** | 2-3 weeks | Collaboration, Global expansion, Advanced AI |
| **Phase 3: Scale** | Ongoing | Monetization, Mobile app, Partnerships |

---

## 💡 Key Success Metrics

- **User acquisition:** 100+ signups in first month
- **Engagement:** 30%+ of users create a trip in first week
- **Retention:** 50%+ DAU/MAU ratio
- **Quality:** <1% error rate on AI itineraries
- **Performance:** <2s page load time, <500ms API responses
- **Sharing:** 20%+ of trips are shared

---

## 🎯 Competitive Advantages vs. Roamy

1. **Global first** (start SE Asia, expand globally) vs. Roamy's Canada-focused launch
2. **Claude AI** (better reasoning, longer context) vs. generic LLMs
3. **Existing user base** (leverage TRVLTOO community)
4. **Multi-day planning** (out of the box) vs. Roamy's focus on single-day
5. **Open for partnerships** (embed in travel sites) vs. Roamy's app-only
6. **Custom persona system** (leverage your Thailand expertise)

---

## 🔗 Resources & Dependencies

### APIs
- **Claude API:** https://docs.anthropic.com/en/api/overview
- **Google Maps API:** https://developers.google.com/maps
- **Firebase:** https://firebase.google.com/docs

### Libraries
- **Frontend:** React 19, Vite, Tailwind CSS
- **Maps:** Leaflet.js or Google Maps SDK
- **PDF export:** jsPDF, html2pdf
- **URL parsing:** url-parse, linkify
- **Date handling:** date-fns, day.js
- **State management:** Zustand or Jotai (optional, if needed)
- **Real-time sync:** Firebase SDK

### Design Inspiration
- Roamy: https://www.roamy.travel/
- Airbnb Experiences: https://www.airbnb.com/experiences
- Google Maps: https://maps.google.com/
- Notion: https://www.notion.so/

---

## 📝 Next Steps

1. **Read this plan** and highlight areas you want to tackle first
2. **Open Claude Code** in VS Code
3. **Start with Phase 1:** Build the spot-saving UI first, then wire it to Firebase
4. **Use Claude Code to:** Generate components, set up API integrations, create utility functions
5. **Test iteratively** with Firebase emulator locally
6. **Deploy to staging** (separate Firebase project) before production

---

## ✅ Checklist for Phase 1 Implementation

- [ ] Set up project structure and routing
- [ ] Create authentication flow (Google login)
- [ ] Design and build landing page
- [ ] Implement spot collection UI (all 4 input methods)
- [ ] Wire up Firestore (save/read spots)
- [ ] Create trip creation workflow
- [ ] Integrate Claude API for itinerary generation
- [ ] Add Leaflet/Google Maps integration
- [ ] Build itinerary display UI
- [ ] Implement basic export (PDF, JSON)
- [ ] Add share/shareable links
- [ ] Test end-to-end (create spot → create trip → generate itinerary → share)

---

**Good luck! You've got this. Use Claude Code aggressively — it's designed for exactly this kind of rapid iteration.** 🚀
