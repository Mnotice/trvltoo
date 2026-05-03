import { CATEGORY_IMAGES } from '../data/destinations';
import { GROUP_CONTEXT, DIETARY_CONTEXT, BUDGET_CONTEXT } from '../data/personas';
import { FEATURE_DATA } from '../data/destinations';
import { buildSlottedPools } from '../activityPool';

const RATE_LIMIT = { dailyMax: 20, cooldownMs: 15_000 };

function checkRateLimit() {
  const now = Date.now();
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem('trvltoo_rl') || '{}');

  if (stored.date !== today) {
    stored.date = today;
    stored.count = 0;
  }

  if (stored.count >= RATE_LIMIT.dailyMax) {
    throw Object.assign(new Error('RATE_LIMIT'), {
      friendly: `Daily limit of ${RATE_LIMIT.dailyMax} generations reached. Come back tomorrow.`,
    });
  }

  if (stored.lastMs && now - stored.lastMs < RATE_LIMIT.cooldownMs) {
    const secs = Math.ceil((RATE_LIMIT.cooldownMs - (now - stored.lastMs)) / 1000);
    throw Object.assign(new Error('RATE_LIMIT'), {
      friendly: `Please wait ${secs}s before generating again.`,
    });
  }

  stored.count += 1;
  stored.lastMs = now;
  localStorage.setItem('trvltoo_rl', JSON.stringify(stored));
}

const buildPrompt = ({ destination, interests, groupContext, dietary, budget, energy, noctourism, area }) => `
You are an expert Southeast Asia travel guide. Generate a personalised one-day itinerary for ${destination}, Thailand.

Traveller profile:
- Group setup: ${GROUP_CONTEXT[groupContext] || groupContext || 'solo traveller'}
- Interests: ${interests && interests.length > 0 ? interests.join(', ') : 'general sightseeing'}
- Dietary: ${DIETARY_CONTEXT[dietary] || 'no dietary restrictions'}
- Budget: ${BUDGET_CONTEXT[budget] || budget}
- Energy level: ${energy}/10 (${energy <= 3 ? 'slow-paced and relaxing' : energy <= 6 ? 'moderate activity' : 'high-intensity, action-packed'})
- Mode: ${noctourism ? 'Night-forward — prioritise evening/nightlife experiences' : 'Daytime-first — focus on daytime activities'}${area ? `\n- Staying in: ${area} — prioritise activities near this area; include day trips where relevant` : ''}

Return ONLY a valid JSON object with exactly this structure — no markdown, no explanation:
{
  "insight": "A warm, personal 4–5 sentence travel briefing written in second person. Open with a sharp read of what kind of day this will be given the traveller's setup and interests. Then give one specific thing to watch out for or take advantage of in ${destination} right now. Close with a sentence that speaks directly to their group context or dietary situation if relevant — make it feel like advice from a well-travelled friend, not a guidebook.",
  "Morning": [
    { "id": "m1", "title": "...", "subtitle": "specific area or neighbourhood in ${destination}", "category": "...", "duration": "X hours", "cost": "~$X–Y", "tip": "one specific practical tip" },
    { "id": "m2", "title": "...", "subtitle": "...", "category": "...", "duration": "...", "cost": "...", "tip": "..." },
    { "id": "m3", "title": "...", "subtitle": "...", "category": "...", "duration": "...", "cost": "...", "tip": "..." }
  ],
  "Afternoon": [
    { "id": "a1", "title": "...", "subtitle": "...", "category": "...", "duration": "...", "cost": "...", "tip": "..." },
    { "id": "a2", "title": "...", "subtitle": "...", "category": "...", "duration": "...", "cost": "...", "tip": "..." },
    { "id": "a3", "title": "...", "subtitle": "...", "category": "...", "duration": "...", "cost": "...", "tip": "..." }
  ],
  "Evening": [
    { "id": "e1", "title": "...", "subtitle": "...", "category": "...", "duration": "...", "cost": "...", "tip": "..." },
    { "id": "e2", "title": "...", "subtitle": "...", "category": "...", "duration": "...", "cost": "...", "tip": "..." },
    { "id": "e3", "title": "...", "subtitle": "...", "category": "...", "duration": "...", "cost": "...", "tip": "..." }
  ]
}

Rules:
- Provide exactly 3 options per slot (Morning / Afternoon / Evening) so the user can re-roll
- category must be one of: Adventure, Culture, Dining, Nature, Sports, Lifestyle, Luxury, Sightseeing
- Morning = 6am–12pm activities, Afternoon = 12pm–6pm, Evening = 6pm–late
- Use real, specific place names in ${destination} — no generic descriptions
- Match budget strictly: $ means cheap local spots only, $$$ means upscale venues
- Match energy: low energy = gentle walks, spas, cafés; high energy = treks, water sports, full-day tours
- cost should be realistic USD for Thailand
- tip should be specific and actionable (e.g. "arrive before 8am to avoid crowds", "book 2 days ahead in high season")
- insight must reference the traveller type and destination — make it feel like a personal briefing
`;

async function generateAIItinerary(prefs) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('No Gemini API key');

  checkRateLimit();

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { responseMimeType: 'application/json', temperature: 0.8, maxOutputTokens: 3000 },
  });

  const expandedPrompt = buildPrompt(prefs).replace(
    'Provide exactly 3 options per slot (Morning / Afternoon / Evening) so the user can re-roll',
    'Provide exactly 8 options per slot (Morning / Afternoon / Evening) so the user can re-roll many times'
  );

  const result = await model.generateContent(expandedPrompt);
  const parsed = JSON.parse(result.response.text());

  ['Morning', 'Afternoon', 'Evening'].forEach(slot => {
    parsed[slot] = (parsed[slot] || []).map(item => ({
      ...item,
      image: CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.Sightseeing,
    }));
  });

  return parsed;
}

async function generateInsightOnly(prefs, topActivities) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { temperature: 0.8, maxOutputTokens: 400 },
    });

    const highlights = topActivities.slice(0, 6).map(a => a.title).join(', ');
    const prompt = `
You are a well-travelled friend giving personalised trip advice.

Traveller:
- Destination: ${prefs.destination}${prefs.area ? ` (staying in ${prefs.area})` : ''}
- With: ${GROUP_CONTEXT[prefs.groupContext] || prefs.groupContext || 'solo'}
- Interests: ${(prefs.interests || []).join(', ') || 'general'}
- Dietary: ${DIETARY_CONTEXT[prefs.dietary] || 'no restrictions'}
- Budget: ${BUDGET_CONTEXT[prefs.budget] || prefs.budget}
- Energy: ${prefs.energy}/10

Today's highlights include: ${highlights}

Write a warm, personal 4–5 sentence briefing in second person. Open with a read of what kind of day this will be. Add one specific local tip for ${prefs.destination} right now. Close with something that speaks directly to their group context or dietary situation. Sound like a friend, not a guidebook.
`.trim();

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return null;
  }
}

export const fetchItinerary = async (prefs, firestorePool = null) => {
  if (firestorePool && firestorePool.length >= 15) {
    const slotted = buildSlottedPools(firestorePool, prefs);

    const hasEnough = ['Morning', 'Afternoon', 'Evening'].every(s => slotted[s].length >= 3);

    if (hasEnough) {
      const topActivities = [
        ...slotted.Morning.slice(0, 2),
        ...slotted.Afternoon.slice(0, 2),
        ...slotted.Evening.slice(0, 2),
      ];

      const withImages = slot => slotted[slot].map(item => ({
        ...item,
        image: CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.Sightseeing,
        cost: item.costTier,
      }));

      const insight = await generateInsightOnly(prefs, topActivities);

      return {
        insight,
        Morning: withImages('Morning'),
        Afternoon: withImages('Afternoon'),
        Evening: withImages('Evening'),
      };
    }
  }

  try {
    return await generateAIItinerary(prefs);
  } catch (err) {
    console.warn('AI generation failed, using curated data:', err.message);
    return FEATURE_DATA[prefs.destination] || null;
  }
};
