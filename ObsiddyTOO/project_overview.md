# TRVLTOO - Tropical Travel Planner

## 🌟 Project Goal
To provide a premium, "Clean Tropical" experience for planning curated high-vibe day trips in Southeast Asia (Phuket, Krabi, Bangkok, Chiang Mai).

## 🚀 Core Features
1. **Interactive Landing Modal**: 
   - Logo fader animation.
   - 4-step tutorial explaining core mechanics.
   - Skip to tool option.
2. **2-Step Onboarding Console**:
   - **Step 1: The Basics (Location/Transport/Dates)**
     - 4 featured hub cards with custom hero imagery.
     - Multi-modal transport preference (Flight, Bus, Train, Car).
     - Integrated single-block date selection.
   - **Step 2: Customization (Vibe & Logistics)**
     - Travel Persona selection (Solo, Couple, Foodie, Nomad).
     - Energy Level Slider (Chill to Active).
     - 3-tier Budget Selection ($, $$, $$$).
     - "Noctourism Mode" (Evening-first priority toggle).
3. **Dynamic Itinerary Engine**:
   - Time-slotted activities (Morning, Afternoon, Evening).
   - **Dice Re-Roll**: Swap activities within the same category pool.
   - **Star Lock**: Save specific favorites during re-rolls.
4. **Intelligent Awareness**:
   - Real-time weather insights (Heat/Rain/UV) adapted dynamically.
   - High UV alert toast notifications.
5. **Portability**:
   - Full Export to Markdown for easy notes or sharing.

## 📁 Repository Structure
- **/src**:
  - `App.jsx`: Main entry point containing core logic and the 2-step onboarding dashboard.
  - `LandingModal.jsx`: Initial onboarding and fader/logo experience.
  - `apiService.js`: Integration with Foursquare Places & Weather APIs.
  - **/assets**: High-resolution local hero images for Phuket, Krabi, etc.
- **/agent/skills**: Directory for defining specific agentic capabilities (Tripadvisor agent).
- **/docs**: Design specifications (`df.md`), roadmaps, and reference materials.

## 🛠️ Technology Stack
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (Modern tropical theme)
- **Animation**: Framer Motion (Spring-based fluid transitions)
- **Icons**: Lucide-React
- **Database**: Supabase (Integration ready)
