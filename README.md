# 🌴 trvltoo

**trvltoo** is a beautifully designed, modern "SEA Travel Planner" built with React, Vite, and Tailwind CSS. It focuses on delivering a *Clean Tropical* aesthetic to map out the perfect curated day trip in Southeast Asia (Phuket, Krabi, Bangkok, and Chiang Mai).

## 🚀 Features

*   **✨ Cinematic Onboarding:** A visual landing modal with logo fader animation and a 4-step interactive tutorial to get you started.
*   **📍 Featured Hubs:** Specialized itinerary logic for **Phuket, Krabi, Bangkok, and Chiang Mai**, complete with high-quality generated imagery.
*   **🚆 Multi-Modal Transport:** Select your preferred travel method (Flight, Bus, Train, or Car) to tailor your journey.
*   **📅 Unified Scheduling:** An integrated, easy-to-use date selection block for seamless trip planning.
*   **🎲 Re-roll Logic:** Not feeling a certain activity? Hit the dice button to instantly swap it out for an alternative venue in the same category pool!
*   **⭐ Lock Mechanic:** Use the star icon over an image to "lock" an activity you love. Locked items won't be replaced when you re-roll.
*   **🌗 Full Dark Mode Support:** A snappy `ThemeToggle` to flawlessly swap between bright, sunny shores and smooth, nocturnal navigation.
*   **🎭 Framer Motion Orchestrations:** Staggered fade-ins and dynamic `layout` transitions for a fluid, premium feel.
*   **📝 Export to Notes:** Automatically converts your current curated itinerary into Markdown text, copying it to your clipboard with a single click.

## 🛠️ Stack

*   **Vite + React 19**
*   **Tailwind CSS (v4)**
*   **Framer Motion** (for staggering array elements and layout animations)
*   **Lucide-React** (for dynamic, consistently styled icons) 

## 📁 Project Structure

*   **/src**: Main application code, including the `LandingModal` and core `App`.
*   **/agent/skills**: Documentation and logic for the future Tripadvisor Agent skills.
*   **/docs**: Project roadmap, markdown references, and architectural notes.
*   **/src/assets**: High-quality locally generated imagery for the featured hubs.

## 🏃 Running Locally

1.  **Clone this repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Add your RapidAPI Foursquare Token to `.env`**:
    ```env
    VITE_RAPIDAPI_KEY=your_key_here
    ```
4.  **Launch the development server**:
    ```bash
    npm run dev
    ```

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or pull requests to help make **trvltoo** the best travel companion for Southeast Asia.

## 📜 License

This project is licensed under the [MIT License](LICENSE).
