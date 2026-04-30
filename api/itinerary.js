import Anthropic from '@anthropic-ai/sdk';
import { sanitizeString } from './_lib/sanitize.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.ALLOWED_ORIGIN,
].filter(Boolean));

function getAllowedOrigin(req) {
  const origin = req.headers.origin ?? '';
  return ALLOWED_ORIGINS.has(origin) ? origin : null;
}

function buildPrompt({ destination, nights, startDate, spots, prefs = {} }) {
  const spotList = spots.length
    ? `\nThe traveller has saved these specific spots they want to visit:\n${spots.map((s, i) =>
        `${i + 1}. ${s.name}${s.address ? ` — ${s.address}` : ''} [${s.category}]${s.notes ? ` (note: ${s.notes})` : ''} [spotId: ${s.id}]`
      ).join('\n')}\nIncorporate as many of these as possible into the itinerary, using the exact spotId field.`
    : '\nNo specific spots have been saved — suggest the best experiences for this destination.';

  const BUDGET_LABELS = { budget: 'Budget / backpacker (~$50/day)', mid: 'Mid-range ($60–120/day)', luxury: 'Luxury ($150+/day)' };
  const travelerProfile = (prefs.budgetTier || prefs.groupType || prefs.travelStyle?.length)
    ? `\nTraveller profile:
- Budget tier: ${BUDGET_LABELS[prefs.budgetTier] ?? 'Mid-range ($60–120/day)'}
- Group type: ${prefs.groupType ?? 'solo'}
- Travel style preferences: ${prefs.travelStyle?.length ? prefs.travelStyle.join(', ') : 'no preference'}
Tailor activity intensity, restaurant price points, and experience types to this profile.`
    : '';

  const ctx = destination.context;
  const localKnowledge = ctx ? `\nLocal knowledge:
- Currency: ${ctx.currency ?? 'local currency'}
- Transport: ${ctx.transport ?? 'local options'}
- Typical daily budget: ${ctx.budget ?? 'varies'}
- Best travel months: ${ctx.bestMonths ?? 'year-round'}
- Top highlights: ${ctx.highlights ?? 'explore locally'}` : '';

  return `You are an expert travel planner. Create a detailed ${nights}-night itinerary for ${destination.city}, ${destination.country}.
Trip starts: ${startDate}${travelerProfile}${localKnowledge}
${spotList}

Generate a complete day-by-day plan. For each day include:
- 3 meals (breakfast, lunch, dinner) at specific named restaurants
- 3-5 activities or sights
- Realistic timing (most people start 8-9am, end midnight at latest)
- Transport hints between spots
- One specific local tip per day

Return ONLY valid JSON matching this exact schema — no markdown, no explanation:
{
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Short evocative day title",
      "activities": [
        {
          "time": "09:00",
          "title": "Venue or activity name",
          "description": "1-2 sentences: what to do and why it's great",
          "category": "food|attraction|nature|hotel|shopping|nightlife|experience",
          "duration": "1.5 hours",
          "cost": "$|$$|$$$",
          "transport": "how to get here from previous stop",
          "tip": "one specific actionable tip",
          "spotId": null
        }
      ],
      "dayBudget": 85,
      "daySummary": "One sentence capturing the day's vibe"
    }
  ],
  "totalBudget": 420,
  "generalTips": ["practical tip 1", "practical tip 2", "practical tip 3"]
}`;
}

export default async function handler(req, res) {
  // CORS — only allow requests from the app's own origin
  const allowedOrigin = getAllowedOrigin(req);
  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!allowedOrigin) return res.status(403).json({ error: 'Forbidden' });

  const { destination, nights, startDate, spots = [], prefs = {} } = req.body ?? {};

  // Input validation
  if (!destination?.city || !destination?.country) {
    return res.status(400).json({ error: 'destination.city and destination.country are required' });
  }
  const nightsNum = parseInt(nights, 10);
  if (!nightsNum || nightsNum < 1 || nightsNum > 30) {
    return res.status(400).json({ error: 'nights must be between 1 and 30' });
  }

  // Sanitize free-text fields that flow into the prompt
  const safeDestination = {
    ...destination,
    city:    sanitizeString(destination.city, 100),
    country: sanitizeString(destination.country, 100),
    context: destination.context ? {
      ...destination.context,
      highlights: sanitizeString(destination.context.highlights ?? '', 500),
      transport:  sanitizeString(destination.context.transport  ?? '', 200),
    } : null,
  };
  const safeSpots = (Array.isArray(spots) ? spots : []).slice(0, 30).map(s => ({
    id:       sanitizeString(String(s.id ?? ''), 100),
    name:     sanitizeString(s.name    ?? '', 150),
    address:  sanitizeString(s.address ?? '', 200),
    category: sanitizeString(s.category ?? '', 50),
    notes:    sanitizeString(s.notes   ?? '', 300),
  }));
  const safePrefs = {
    budgetTier:  sanitizeString(prefs.budgetTier  ?? '', 20),
    groupType:   sanitizeString(prefs.groupType   ?? '', 20),
    travelStyle: Array.isArray(prefs.travelStyle)
      ? prefs.travelStyle.slice(0, 10).map(s => sanitizeString(s, 30))
      : [],
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Set up Server-Sent Events stream
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');

  try {
    const stream = await client.messages.stream({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      messages:   [{ role: 'user', content: buildPrompt({ destination: safeDestination, nights: nightsNum, startDate, spots: safeSpots, prefs: safePrefs }) }],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        // Send each text chunk as an SSE event
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch {
    res.write(`data: ${JSON.stringify({ error: 'Itinerary generation failed. Please try again.' })}\n\n`);
    res.end();
  }
}
