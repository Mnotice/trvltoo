# 🌴 trvltoo

**trvltoo** is a beautifully designed, modern "SEA Travel Planner" built with React, Vite, and Tailwind CSS. It focuses on delivering a *Clean Tropical* aesthetic to map out the perfect curated day trip in Southeast Asia (currently Krabi and Phuket).

## 🚀 Features

*   **Dynamic Itinerary Generation:** Generates an itinerary with specific venues slotted into Morning, Afternoon, and Evening blocks.
*   **🎲 Re-roll Logic:** Not feeling a certain activity? Hit the dice button to instantly swap it out for an alternative venue in the same category pool!
*   **⭐ Lock Mechanic:** Use the star icon over an image to "lock" an activity you love. Locked items won't be replaced when you re-roll.
*   **🌍 Location Switcher:** Easily toggle between different cities (e.g., Krabi to Phuket) instantly via the top navigation bar.
*   **✨ Clean Tropical Aesthetics:** Employs a crisp layout with ample white space, rounded corners, drop shadows, and deep teal accents running throughout the app.
*   **🗺️ Ambient Topographical Overlays:** Includes gorgeous subtle topographical contour lines flowing seamlessly in both Light and Dark themes.
*   **🌗 Full Dark Mode Support:** Includes a snappy `ThemeToggle` to flawlessly swap between bright, sunny shores and smooth, dark navigation.
*   **🎭 Framer Motion Orchestrations:** Employs beautiful staggered fade-ins and dynamic `layout` transitions so when you change activities or swap cities, the timeline glides fluidly.
*   **Foursquare Places Integration:** Fully hooked up via RapidAPI to pull authentic local datasets and dynamically slot them into appropriate categories.
*   **📝 Export to Notes:** Automatically converts your current curated itinerary into Markdown text, copying it to your clipboard with a single click natively.

## 🛠️ Stack

*   **Vite + React**
*   **Tailwind CSS (v4)**
*   **Framer Motion** (for staggering array elements and layout animations)
*   **Lucide-React** (for dynamic, consistently styled icons) 

## 🏃 Running Locally

1.  Clone this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Add your RapidAPI Foursquare Token to `.env`:
    ```
    VITE_RAPIDAPI_KEY=your_key_here
    ```
4.  Launch the development server:
    ```bash
    npm run dev
    ```
