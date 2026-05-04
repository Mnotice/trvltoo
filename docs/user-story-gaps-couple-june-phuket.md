# User Story Gap Analysis — Couple, June Phuket, 2 Weeks

**User story:**
> "I have been planning a June Phuket trip with my boyfriend. We will be there for around two weeks. Does anyone have any customs or warnings for Americans visiting that we would not already know? (We are a boring couple and are not drinkers or perverts.) Does anyone have any places, shops, or activities they would recommend?"

**Profile:** American couple, ~14 nights, June, non-drinkers, culture-curious

---

## What Works

- Couple persona, Phuket destination, 14-night date range all supported
- Day trip pool (Phi Phi, Phang Nga Bay, Racha Yai) relevant
- Things to Avoid tab covers scams and safety basics
- Evening pool is not actually bar-heavy — Muay Thai, night markets, sunset spots, pier seafood all work for non-drinkers

---

## Gaps — Ranked by Impact

### 1. Thai Cultural Customs & Etiquette — Missing Entirely (HIGH)

Their primary question. The app has zero coverage of:

- **The Wai** — how and when to return a greeting vs. initiate one
- **Head is sacred** — never touch anyone's head, even children
- **Feet are low** — don't point feet at people, Buddha images, or monks; don't step over someone
- **Shoes off** — before entering temples, many local homes, and some restaurants
- **Lèse-majesté** — criticising the royal family is a criminal offence; Americans have been arrested. This is not obvious to US visitors.
- **Drug laws** — Thailand has executed people for drug trafficking. Americans who assume "it's like Amsterdam" are at serious risk.
- **Temple dress code depth** — shoulders and knees covered, no sleeveless, some temples require long trousers
- **Photography rules** — no photos of monks without permission; no selfies with Buddha images in some temples
- **Tipping culture** — 20–30 THB for small services, 5–10% at restaurants; American 20% standard is not expected and can cause confusion
- **Bargaining etiquette** — expected at markets, never at malls or fixed-price shops; smile throughout, never get angry
- **Receiving/giving with two hands** — polite when handing money, documents, or gifts
- **Raising your voice** — losing face is serious; visible frustration or confrontation is considered very rude

**Fix:** Add a "Culture & Customs" tab to the Local Intel panel per destination.

---

### 2. Persona Doesn't Affect the Pool (HIGH)

Selecting "Couple" produces the exact same activity pool as Solo, Nomad, or Friends. For a romantic couple, the pool should be weighted toward:

- Sunset experiences (Promthep Cape, private longtail at sunrise)
- Spa & wellness
- Private or semi-private tours
- Cultural / temple visits
- Intimate dining over group/street settings

**Fix:** Add a `personas` array to each activity in `FEATURE_DATA` listing which personas it's a good fit for. Use it as a third sort dimension after area and budget.

---

### 3. No Interest / Vibe Filters (MEDIUM)

No way to signal "culture-focused", "no nightlife", "outdoors & nature", or "shopping". The user explicitly says they don't drink — the app can't accommodate that signal. A nightlife-tagged activity could still surface as their evening pick.

**Fix:** Add optional interest toggles to the Plan view (e.g. Culture, Nature, Wellness, Nightlife-free, Shopping). Use them to re-weight the pool sort score.

---

### 4. June = Peak Monsoon, Not Addressed (MEDIUM)

The Local Intel currently references May weather. June is worse:

- Similan Islands **definitively closed** (season ends ~May 15) — the app still surfaces it as a day trip with no warning
- Andaman-side beaches (Patong, Kata, Karon) have rough surf and frequent red flags
- Daily afternoon storms, sometimes lasting 3–4 hours
- Phi Phi and Phang Nga still operate but morning-only departures are strongly advised

**Fix:** Make weather and season tips month-aware. Pass `arrivalDate` month into `getDestinationTips()` and return month-specific warnings. At minimum, add a June section to `thailand_expert_tips.md` and surface a warning when Similan is in the day trip pool for June trips.

---

### 5. Shopping — Zero Coverage (LOW–MEDIUM)

User explicitly asks about shops. Nothing in the product:

- Old Phuket Town boutiques and art galleries (Thalang Road, Dibuk Road)
- OTOP market (government-certified local crafts, fixed price, no bargaining)
- Central Festival Phuket (main mall, reliable quality, air-conditioned)
- Sunday market at Naka for handicrafts
- What to actually buy: hand-carved soaps, silk, Thai ceramics, tailor-made clothes

**Fix:** Add a "Shopping" section to `DESTINATION_TIPS` and either surface it as a Local Intel tab or fold it into the Food tab as "Food & Shopping".

---

## Suggested Build Order

1. **Culture & Customs tab** in Local Intel — directly answers their question, low complexity, high value for every user
2. **Persona-based pool weighting** — tag activities with compatible personas, add to sort score
3. **Month-aware season warnings** — flag Similan closure and June monsoon in the result view
4. **Interest filters** in Plan view — nightlife-free toggle is the minimum viable version
5. **Shopping layer** in DESTINATION_TIPS
