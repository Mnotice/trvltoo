/**
 * One-time activity pool seed script.
 *
 * SETUP — two things needed before running:
 *
 * 1. Service account JSON
 *    Firebase Console → Project Settings → Service Accounts → Generate new private key
 *    Save the downloaded file as: functions/service-account.json
 *
 * 2. Run from the functions/ directory:
 *    VITE_GEMINI_API_KEY=your_key node seed-activities.js
 *
 *    Or set the key in your shell first:
 *    export VITE_GEMINI_API_KEY=your_key
 *    node seed-activities.js
 *
 * The script writes to Firestore: activities/{destination}/items/{auto-id}
 * Re-running is safe — it clears old items before writing new ones.
 */

'use strict';

const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

// ── Auth ──────────────────────────────────────────────────────────────────────
let credential;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  credential = admin.credential.applicationDefault();
} else {
  try {
    const sa = require('./service-account.json');
    credential = admin.credential.cert(sa);
  } catch {
    console.error('\n❌  No credentials found.\n');
    console.error('    Either set GOOGLE_APPLICATION_CREDENTIALS or place');
    console.error('    your service account JSON at functions/service-account.json\n');
    process.exit(1);
  }
}

admin.initializeApp({ credential, projectId: 'trvltoo-4c81f' });
const db = admin.firestore();

// ── Gemini ────────────────────────────────────────────────────────────────────
const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('\n❌  VITE_GEMINI_API_KEY env var is required.\n');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// ── Destinations ─────────────────────────────────────────────────────────────
const DESTINATIONS = [
  'Phuket', 'Krabi', 'Bangkok', 'Chiang Mai', 'Koh Samui',
  'Koh Phangan', 'Koh Tao', 'Chiang Rai', 'Ayutthaya',
  'Hua Hin', 'Pai', 'Koh Lanta',
];

const VALID_CATEGORIES = [
  'Adventure', 'Culture', 'Dining', 'Nature', 'Sports',
  'Lifestyle', 'Luxury', 'Sightseeing',
];

const VALID_SLOTS    = ['Morning', 'Afternoon', 'Evening', 'Any'];
const VALID_INTERESTS = [
  'Nature', 'Food', 'Culture', 'Adventure', 'Nightlife',
  'Wellness', 'Shopping', 'Photography', 'History', 'Water Sports',
];
const VALID_COST_TIERS = ['$', '$$', '$$$'];

// ── Prompt ────────────────────────────────────────────────────────────────────
function buildSeedPrompt(destination) {
  return `
You are an expert Southeast Asia travel guide with deep knowledge of ${destination}, Thailand.
Generate a comprehensive list of real, specific tourist activities and dining experiences there.
Cover a broad mix — morning sights, afternoon adventures, evening dining and nightlife.

Return ONLY a JSON array of exactly 30 items. No markdown, no explanation, no trailing text — just the raw JSON array.

Each item must use this exact schema:
{
  "title": "Specific venue or activity name",
  "subtitle": "Exact neighbourhood or landmark, ${destination}",
  "category": one of ${VALID_CATEGORIES.join('|')},
  "slot": one of ${VALID_SLOTS.join('|')},
  "area": "which part of ${destination} (e.g. Old City, Patong, Nimman)",
  "interests": array of 1–4 values from [${VALID_INTERESTS.join(', ')}],
  "costTier": one of $ | $$ | $$$,
  "duration": "X hours" or "half day" etc,
  "tip": "one specific, actionable local tip"
}

Rules:
- Use real, named venues and places — no generic descriptions
- Spread evenly: ~14 Morning, ~13 Afternoon, ~13 Evening (slot="Any" counts as flexible)
- Spread across budget tiers: ~14 each of $, $$, $$$
- Cover diverse interests — do not cluster on one category
- tip must be specific (opening hours, booking advice, local knowledge)
`.trim();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractJson(text) {
  // Try direct parse first (responseMimeType: application/json), then fallback to regex
  try { return JSON.parse(text); } catch {}
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON array found in response');
  return JSON.parse(match[0]);
}

function sanitiseItem(raw) {
  return {
    title:     String(raw.title || '').trim(),
    subtitle:  String(raw.subtitle || '').trim(),
    category:  VALID_CATEGORIES.includes(raw.category) ? raw.category : 'Sightseeing',
    slot:      VALID_SLOTS.includes(raw.slot) ? raw.slot : 'Any',
    area:      String(raw.area || '').trim(),
    interests: (Array.isArray(raw.interests) ? raw.interests : [])
                 .filter(i => VALID_INTERESTS.includes(i)),
    costTier:  VALID_COST_TIERS.includes(raw.costTier) ? raw.costTier : '$$',
    duration:  String(raw.duration || '').trim(),
    tip:       String(raw.tip || '').trim(),
    seedDate:  admin.firestore.FieldValue.serverTimestamp(),
  };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ──────────────────────────────────────────────────────────────────────
async function seedDestination(destination) {
  console.log(`\n🌍  ${destination}`);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { responseMimeType: 'application/json', temperature: 0.4, maxOutputTokens: 6000 },
  });

  let items;
  try {
    const result = await model.generateContent(buildSeedPrompt(destination));
    const text   = result.response.text();
    const raw    = extractJson(text);
    items = raw.map(sanitiseItem).filter(i => i.title.length > 0);
    console.log(`   ✓  ${items.length} activities generated`);
  } catch (err) {
    console.error(`   ✗  Generation failed: ${err.message}`);
    return;
  }

  // Clear old items then batch-write new ones
  const colRef = db.collection('activities').doc(destination).collection('items');
  const existing = await colRef.get();
  const delBatch = db.batch();
  existing.docs.forEach(d => delBatch.delete(d.ref));
  await delBatch.commit();

  const CHUNK = 499;
  for (let i = 0; i < items.length; i += CHUNK) {
    const batch = db.batch();
    items.slice(i, i + CHUNK).forEach(item => batch.set(colRef.doc(), item));
    await batch.commit();
  }
  console.log(`   ✓  Written to Firestore`);
}

async function main() {
  console.log('═══════════════════════════════════');
  console.log('  TRVLTOO Activity Pool Seed Script');
  console.log('═══════════════════════════════════');

  for (const dest of DESTINATIONS) {
    await seedDestination(dest);
    // 65s gap keeps us well under the free tier's 15 RPM limit
    if (dest !== DESTINATIONS[DESTINATIONS.length - 1]) {
      process.stdout.write('   ⏳  Waiting 65s for rate limit...');
      await sleep(65000);
      process.stdout.write(' done\n');
    }
  }

  console.log('\n✅  All destinations seeded.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err);
  process.exit(1);
});
